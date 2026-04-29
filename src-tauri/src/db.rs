use std::{
    fs,
    path::{Path, PathBuf},
};

use chrono::{Datelike, Duration, NaiveDate, Utc};
use rusqlite::{params, Connection, Error as RusqliteError, ErrorCode, OptionalExtension};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::{AppHandle, Manager};

const DEFAULT_ADMIN_USERNAME: &str = "admin";
const DEFAULT_ADMIN_PASSWORD: &str = "123456";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GymProfile {
    pub id: i64,
    pub name: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GymProfileInput {
    pub name: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StudentRecord {
    pub id: String,
    pub cloud_id: Option<String>,
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub due_date: String,
    pub shift: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StudentUpsertInput {
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub due_date: String,
    pub shift: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthUser {
    pub id: String,
    pub username: String,
    pub role: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginInput {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCredentialsInput {
    pub user_id: String,
    pub new_username: String,
    pub current_password: String,
    pub new_password: Option<String>,
}

fn now_iso() -> String {
    Utc::now().to_rfc3339()
}

fn open_database(app: &AppHandle) -> Result<Connection, String> {
    let db_path = database_path(app)?;

    if let Some(parent) = db_path.parent() {
        fs::create_dir_all(parent).map_err(|err| err.to_string())?;
    }

    let connection = Connection::open(db_path).map_err(|err| err.to_string())?;
    connection
        .execute_batch(
            "
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS gym_profile (
              id INTEGER PRIMARY KEY CHECK (id = 1),
              name TEXT,
              phone TEXT,
              address TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS app_users (
              id TEXT PRIMARY KEY,
              username TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL DEFAULT 'owner',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS students (
              id TEXT PRIMARY KEY,
              cloud_id TEXT,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              phone TEXT NOT NULL,
              due_date TEXT NOT NULL,
              shift TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              archived_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_students_shift ON students(shift);
            CREATE INDEX IF NOT EXISTS idx_students_due_date ON students(due_date);
            CREATE INDEX IF NOT EXISTS idx_students_archived_at ON students(archived_at);

            CREATE TABLE IF NOT EXISTS payments (
              id TEXT PRIMARY KEY,
              student_id TEXT NOT NULL,
              amount_cents INTEGER,
              currency TEXT NOT NULL DEFAULT 'ARS',
              months_paid INTEGER NOT NULL DEFAULT 1,
              paid_at TEXT NOT NULL,
              due_date_after TEXT NOT NULL,
              note TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
            );
            ",
        )
        .map_err(|err| err.to_string())?;

    ensure_default_admin(&connection)?;
    enforce_single_user(&connection, None)?;

    Ok(connection)
}

fn database_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app.path().app_data_dir().map_err(|err| err.to_string())?;
    Ok(app_dir.join(Path::new("data").join("gym-control.sqlite")))
}

fn map_student_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<StudentRecord> {
    Ok(StudentRecord {
        id: row.get("id")?,
        cloud_id: row.get("cloud_id")?,
        first_name: row.get("first_name")?,
        last_name: row.get("last_name")?,
        phone: row.get("phone")?,
        due_date: row.get("due_date")?,
        shift: row.get("shift")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

pub fn get_gym_profile(app: &AppHandle) -> Result<GymProfile, String> {
    let connection = open_database(app)?;
    
    let now = now_iso();
    connection.execute(
        "INSERT OR IGNORE INTO gym_profile (id, created_at, updated_at) VALUES (1, ?1, ?2)",
        params![now, now],
    ).map_err(|err| err.to_string())?;

    connection
        .query_row(
            "SELECT id, name, phone, address, created_at, updated_at FROM gym_profile WHERE id = 1",
            [],
            |row| {
                Ok(GymProfile {
                    id: row.get("id")?,
                    name: row.get("name")?,
                    phone: row.get("phone")?,
                    address: row.get("address")?,
                    created_at: row.get("created_at")?,
                    updated_at: row.get("updated_at")?,
                })
            },
        )
        .map_err(|err| err.to_string())
}

pub fn update_gym_profile(app: &AppHandle, input: GymProfileInput) -> Result<GymProfile, String> {
    let connection = open_database(app)?;
    let updated_at = now_iso();
    
    connection.execute(
        "INSERT OR IGNORE INTO gym_profile (id, created_at, updated_at) VALUES (1, ?1, ?1)",
        params![updated_at],
    ).map_err(|err| err.to_string())?;

    connection.execute(
        "
        UPDATE gym_profile 
        SET name = ?1, phone = ?2, address = ?3, updated_at = ?4
        WHERE id = 1
        ",
        params![input.name, input.phone, input.address, updated_at],
    ).map_err(|err| err.to_string())?;

    get_gym_profile(app)
}

pub fn list_students(app: &AppHandle) -> Result<Vec<StudentRecord>, String> {
    let connection = open_database(app)?;
    let mut statement = connection
        .prepare(
            "
            SELECT id, cloud_id, first_name, last_name, phone, due_date, shift, created_at, updated_at
            FROM students
            WHERE archived_at IS NULL
            ORDER BY last_name COLLATE NOCASE, first_name COLLATE NOCASE
            ",
        )
        .map_err(|err| err.to_string())?;

    let rows = statement
        .query_map([], map_student_row)
        .map_err(|err| err.to_string())?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|err| err.to_string())
}

pub fn create_student(app: &AppHandle, input: StudentUpsertInput) -> Result<StudentRecord, String> {
    let connection = open_database(app)?;
    let now = now_iso();
    let student = StudentRecord {
        id: uuid::Uuid::new_v4().to_string(),
        cloud_id: None,
        first_name: input.first_name.trim().to_string(),
        last_name: input.last_name.trim().to_string(),
        phone: input.phone.trim().to_string(),
        due_date: input.due_date,
        shift: input.shift,
        created_at: now.clone(),
        updated_at: now,
    };

    connection
        .execute(
            "
            INSERT INTO students (
              id, cloud_id, first_name, last_name, phone, due_date, shift, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
            ",
            params![
                student.id,
                student.cloud_id,
                student.first_name,
                student.last_name,
                student.phone,
                student.due_date,
                student.shift,
                student.created_at,
                student.updated_at
            ],
        )
        .map_err(|err| err.to_string())?;

    get_student_by_id(&connection, &student.id)?
        .ok_or_else(|| "No se pudo recuperar el alumno creado".to_string())
}

pub fn update_student(
    app: &AppHandle,
    id: String,
    input: StudentUpsertInput,
) -> Result<StudentRecord, String> {
    let connection = open_database(app)?;
    let updated_at = now_iso();

    let rows = connection
        .execute(
            "
            UPDATE students
            SET first_name = ?1,
                last_name = ?2,
                phone = ?3,
                due_date = ?4,
                shift = ?5,
                updated_at = ?6
            WHERE id = ?7 AND archived_at IS NULL
            ",
            params![
                input.first_name.trim(),
                input.last_name.trim(),
                input.phone.trim(),
                input.due_date,
                input.shift,
                updated_at,
                id
            ],
        )
        .map_err(|err| err.to_string())?;

    if rows == 0 {
        return Err("Alumno no encontrado".to_string());
    }

    get_student_by_id(&connection, &id)?
        .ok_or_else(|| "No se pudo recuperar el alumno actualizado".to_string())
}

pub fn delete_student(app: &AppHandle, id: String) -> Result<(), String> {
    let connection = open_database(app)?;
    let updated_at = now_iso();
    let rows = connection
        .execute(
            "
            UPDATE students
            SET archived_at = ?1, updated_at = ?1
            WHERE id = ?2 AND archived_at IS NULL
            ",
            params![updated_at, id],
        )
        .map_err(|err| err.to_string())?;

    if rows == 0 {
        return Err("Alumno no encontrado".to_string());
    }

    Ok(())
}

pub fn renew_student_subscription(
    app: &AppHandle,
    id: String,
    months: u32,
) -> Result<StudentRecord, String> {
    let connection = open_database(app)?;
    let current =
        get_student_by_id(&connection, &id)?.ok_or_else(|| "Alumno no encontrado".to_string())?;

    let current_due_date = chrono::DateTime::parse_from_rfc3339(&current.due_date)
        .map_err(|err| err.to_string())?
        .with_timezone(&Utc)
        .date_naive();

    let new_due_date = add_months_clamped(current_due_date, months)
        .ok_or_else(|| "No se pudo calcular la nueva fecha de vencimiento".to_string())?;

    let due_date = new_due_date
        .and_hms_opt(0, 0, 0)
        .ok_or_else(|| "Fecha de vencimiento invalida".to_string())?
        .and_utc()
        .to_rfc3339();
    let updated_at = now_iso();

    connection
        .execute(
            "
            UPDATE students
            SET due_date = ?1, updated_at = ?2
            WHERE id = ?3 AND archived_at IS NULL
            ",
            params![due_date, updated_at, id],
        )
        .map_err(|err| err.to_string())?;

    get_student_by_id(&connection, &id)?
        .ok_or_else(|| "No se pudo recuperar el alumno renovado".to_string())
}

fn add_months_clamped(date: NaiveDate, months: u32) -> Option<NaiveDate> {
    let total_months = date.year() as i64 * 12 + date.month0() as i64 + months as i64;
    let year = (total_months / 12) as i32;
    let month0 = (total_months % 12) as u32;
    let month = month0 + 1;

    let last_day = last_day_of_month(year, month)?;
    let day = date.day().min(last_day);

    NaiveDate::from_ymd_opt(year, month, day)
}

fn last_day_of_month(year: i32, month: u32) -> Option<u32> {
    let (next_year, next_month) = if month == 12 { (year + 1, 1) } else { (year, month + 1) };
    let first_next = NaiveDate::from_ymd_opt(next_year, next_month, 1)?;
    let last = first_next.checked_sub_signed(Duration::days(1))?;
    Some(last.day())
}

pub fn import_students(
    app: &AppHandle,
    students: Vec<StudentRecord>,
) -> Result<Vec<StudentRecord>, String> {
    let mut connection = open_database(app)?;
    let transaction = connection.transaction().map_err(|err| err.to_string())?;

    for student in students {
        transaction
            .execute(
                "
                INSERT OR IGNORE INTO students (
                  id, cloud_id, first_name, last_name, phone, due_date, shift, created_at, updated_at
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
                ",
                params![
                    student.id,
                    student.cloud_id,
                    student.first_name.trim(),
                    student.last_name.trim(),
                    student.phone.trim(),
                    student.due_date,
                    student.shift,
                    student.created_at,
                    student.updated_at
                ],
            )
            .map_err(|err| err.to_string())?;
    }

    transaction.commit().map_err(|err| err.to_string())?;
    list_students(app)
}

pub fn login(app: &AppHandle, input: LoginInput) -> Result<AuthUser, String> {
    let connection = open_database(app)?;
    let username = input.username.trim().to_lowercase();
    let password_hash = hash_password(&input.password);

    connection
        .query_row(
            "
            SELECT id, username, role
            FROM app_users
            WHERE username = ?1 AND password_hash = ?2
            ",
            params![username, password_hash],
            |row| {
                Ok(AuthUser {
                    id: row.get("id")?,
                    username: row.get("username")?,
                    role: row.get("role")?,
                })
            },
        )
        .optional()
        .map_err(|err| err.to_string())?
        .ok_or_else(|| "Usuario o contrasena invalidos".to_string())
}

pub fn update_user_credentials(
    app: &AppHandle,
    input: UpdateCredentialsInput,
) -> Result<AuthUser, String> {
    let connection = open_database(app)?;
    let current_hash = hash_password(&input.current_password);
    
    // Verify current user
    let user_id: String = connection
        .query_row(
            "SELECT id FROM app_users WHERE id = ?1 AND password_hash = ?2",
            params![input.user_id, current_hash],
            |row| row.get(0),
        )
        .optional()
        .map_err(|err| err.to_string())?
        .ok_or_else(|| "La contraseña actual es incorrecta.".to_string())?;

    // Legacy cleanup: if multiple users exist, keep the authenticated one.
    enforce_single_user(&connection, Some(&user_id))?;

    let updated_at = now_iso();
    let new_username = input.new_username.trim().to_lowercase();

    if new_username.is_empty() {
        return Err("El nombre de usuario no puede estar vacio.".to_string());
    }

    let username_in_use: Option<String> = connection
        .query_row(
            "SELECT id FROM app_users WHERE username = ?1 AND id <> ?2",
            params![new_username, user_id],
            |row| row.get(0),
        )
        .optional()
        .map_err(|err| err.to_string())?;

    if username_in_use.is_some() {
        return Err("Ese nombre de usuario ya esta en uso.".to_string());
    }
    
    if let Some(new_password) = input.new_password {
        let new_hash = hash_password(&new_password);
        let result = connection.execute(
            "UPDATE app_users SET username = ?1, password_hash = ?2, updated_at = ?3 WHERE id = ?4",
            params![new_username, new_hash, updated_at, user_id],
        );

        if let Err(err) = result {
            if matches!(
                err,
                RusqliteError::SqliteFailure(ref sqlite_err, _)
                    if sqlite_err.code == ErrorCode::ConstraintViolation
            ) {
                return Err("Ese nombre de usuario ya esta en uso.".to_string());
            }
            return Err(err.to_string());
        }
    } else {
        let result = connection.execute(
            "UPDATE app_users SET username = ?1, updated_at = ?2 WHERE id = ?3",
            params![new_username, updated_at, user_id],
        );

        if let Err(err) = result {
            if matches!(
                err,
                RusqliteError::SqliteFailure(ref sqlite_err, _)
                    if sqlite_err.code == ErrorCode::ConstraintViolation
            ) {
                return Err("Ese nombre de usuario ya esta en uso.".to_string());
            }
            return Err(err.to_string());
        }
    }

    // Return updated user
    connection
        .query_row(
            "SELECT id, username, role FROM app_users WHERE id = ?1",
            params![user_id],
            |row| {
                Ok(AuthUser {
                    id: row.get("id")?,
                    username: row.get("username")?,
                    role: row.get("role")?,
                })
            },
        )
        .map_err(|err| err.to_string())
}

pub fn get_login_username_hint(app: &AppHandle) -> Result<String, String> {
    let connection = open_database(app)?;

    connection
        .query_row(
            "
            SELECT username
            FROM app_users
            ORDER BY updated_at DESC, created_at DESC
            LIMIT 1
            ",
            [],
            |row| row.get(0),
        )
        .map_err(|err| err.to_string())
}

fn enforce_single_user(
    connection: &Connection,
    preferred_user_id: Option<&str>,
) -> Result<(), String> {
    #[derive(Debug)]
    struct UserRow {
        id: String,
        username: String,
    }

    let mut statement = connection
        .prepare(
            "
            SELECT id, username
            FROM app_users
            ORDER BY updated_at DESC, created_at DESC
            ",
        )
        .map_err(|err| err.to_string())?;

    let users = statement
        .query_map([], |row| {
            Ok(UserRow {
                id: row.get(0)?,
                username: row.get(1)?,
            })
        })
        .map_err(|err| err.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|err| err.to_string())?;

    if users.len() <= 1 {
        return Ok(());
    }

    let keep_id = preferred_user_id
        .and_then(|preferred| {
            users
                .iter()
                .find(|user| user.id == preferred)
                .map(|user| user.id.clone())
        })
        .or_else(|| {
            users
                .iter()
                .find(|user| user.username != DEFAULT_ADMIN_USERNAME)
                .map(|user| user.id.clone())
        })
        .or_else(|| users.first().map(|user| user.id.clone()))
        .ok_or_else(|| "No se pudo seleccionar un usuario principal".to_string())?;

    connection
        .execute("DELETE FROM app_users WHERE id <> ?1", params![keep_id])
        .map_err(|err| err.to_string())?;

    Ok(())
}

fn get_student_by_id(connection: &Connection, id: &str) -> Result<Option<StudentRecord>, String> {
    connection
        .query_row(
            "
            SELECT id, cloud_id, first_name, last_name, phone, due_date, shift, created_at, updated_at
            FROM students
            WHERE id = ?1 AND archived_at IS NULL
            ",
            [id],
            map_student_row,
        )
        .optional()
        .map_err(|err| err.to_string())
}

fn ensure_default_admin(connection: &Connection) -> Result<(), String> {
    let existing_any_user: Option<String> = connection
        .query_row("SELECT id FROM app_users LIMIT 1", [], |row| row.get(0))
        .optional()
        .map_err(|err| err.to_string())?;

    if existing_any_user.is_some() {
        return Ok(());
    }

    let now = now_iso();
    connection
        .execute(
            "
            INSERT INTO app_users (id, username, password_hash, role, created_at, updated_at)
            VALUES (?1, ?2, ?3, 'owner', ?4, ?5)
            ",
            params![
                uuid::Uuid::new_v4().to_string(),
                DEFAULT_ADMIN_USERNAME,
                hash_password(DEFAULT_ADMIN_PASSWORD),
                now,
                now
            ],
        )
        .map_err(|err| err.to_string())?;

    Ok(())
}

fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    format!("{:x}", hasher.finalize())
}
