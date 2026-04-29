use tauri::AppHandle;

use crate::db::{
    self, AuthUser, GymProfile, GymProfileInput, LoginInput, StudentRecord, StudentUpsertInput,
    UpdateCredentialsInput,
};

#[tauri::command]
pub fn login(app: AppHandle, input: LoginInput) -> Result<AuthUser, String> {
    db::login(&app, input)
}

#[tauri::command]
pub fn update_user_credentials(
    app: AppHandle,
    input: UpdateCredentialsInput,
) -> Result<AuthUser, String> {
    db::update_user_credentials(&app, input)
}

#[tauri::command]
pub fn get_login_username_hint(app: AppHandle) -> Result<String, String> {
    db::get_login_username_hint(&app)
}

#[tauri::command]
pub fn list_students(app: AppHandle) -> Result<Vec<StudentRecord>, String> {
    db::list_students(&app)
}

#[tauri::command]
pub fn get_gym_profile(app: AppHandle) -> Result<GymProfile, String> {
    db::get_gym_profile(&app)
}

#[tauri::command]
pub fn update_gym_profile(app: AppHandle, input: GymProfileInput) -> Result<GymProfile, String> {
    db::update_gym_profile(&app, input)
}

#[tauri::command]
pub fn create_student(app: AppHandle, input: StudentUpsertInput) -> Result<StudentRecord, String> {
    db::create_student(&app, input)
}

#[tauri::command]
pub fn update_student(
    app: AppHandle,
    id: String,
    input: StudentUpsertInput,
) -> Result<StudentRecord, String> {
    db::update_student(&app, id, input)
}

#[tauri::command]
pub fn delete_student(app: AppHandle, id: String) -> Result<(), String> {
    db::delete_student(&app, id)
}

#[tauri::command]
pub fn renew_student_subscription(
    app: AppHandle,
    id: String,
    months: u32,
) -> Result<StudentRecord, String> {
    db::renew_student_subscription(&app, id, months)
}

#[tauri::command]
pub fn import_students(
    app: AppHandle,
    students: Vec<StudentRecord>,
) -> Result<Vec<StudentRecord>, String> {
    db::import_students(&app, students)
}
