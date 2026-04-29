mod commands;
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::login,
            commands::update_user_credentials,
            commands::get_login_username_hint,
            commands::list_students,
            commands::get_gym_profile,
            commands::update_gym_profile,
            commands::create_student,
            commands::update_student,
            commands::delete_student,
            commands::renew_student_subscription,
            commands::import_students
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
