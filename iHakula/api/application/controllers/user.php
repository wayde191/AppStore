<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class User extends CI_Controller {

	public function index()
	{
		$this->load->view('welcome_message');
	}
  
  public function setSession() {
    global $IH_SESSION_LOGGEDIN;
    global $IH_SESSION_PATH;
    
    $lifeTime = 24 * 3600; // one day
    session_set_cookie_params($lifetime);
//    session_save_path($IH_SESSION_PATH);
    session_start();
    $_SESSION[$IH_SESSION_LOGGEDIN] = TRUE;
  }

	public function login(){
        
        $username = $_POST['username'];
        $password = $_POST['password'];

		// $_POST['log'] = $username;
		// $_POST['pwd'] = $password;
        $credentials = array("user_login" => $username,"user_password" => $password,);
		
		$user = wp_signon($credentials, '');
        if($user->ID == 0) {
            echo json_encode(array("status" => 0, "errorCode" => -2));
        } else {
            wp_set_current_user($user->ID);
            $this->setSession();
            echo json_encode(array("status" => 1, "name" => $user->user_login, "id" => $user->ID, "sex" => $user->sex));
        }
        
	}
  
  public function register(){
    
    date_default_timezone_set('Asia/Chongqing');
    $date = '"'. date('Y-m-d H:i:s') . '"';
    
    $this->load->database();
    $sql = "INSERT INTO  `ih_users` (
              `user_email` ,
              `user_url` ,
              `user_pass` ,
              `user_registered` ,
              `user_lasttime_login`
              )
              VALUES (
              'wsun191@gmail.com', 'www.ihakula.com', 'helloworld', $date, $date
              )";
    
    $this->db->query($sql);
            
    if (1 == $this->db->affected_rows()) {
      echo json_encode(array("status" => 1));
    } else {
      echo json_encode(array("status" => 0));
    }
  }
}