import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false); //this is state for checking if user is logged in or not

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignup = async (credentials) => {
    // taking the arguments as individual variables
    const { username, email, password } = credentials;

    // defining error message for validation
    if (username.length < 4) {
      return (errorMessage.value = "Username is too short.");
    }

    if (!validateEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }

    if (password.length < 6) {
      return (errorMessage.value = "Password is weak and short.");
    }

    // before hitting any supabase api we make the loading true, later after response of every api we will make it false to show message
    loading.value = true;

    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username);

    // if user exist with username we cannot register it again
    if (userWithUsername.length > 0) {
      loading.value = false;
      return (errorMessage.value = "User already registered with username.");
    }

    // clear any previous error messages if there are no errors.
    errorMessage.value = "";

    /* it return the object and has 2 items, 
    (1) data which stores success response, 
    (2) error which stores error response if the request fail
    
    this is the best way to store multiple keys from object an object as a variable so we will be able to access it with dot. */
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // if there is an error during signupt return the message and make the loading false
    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    // if there is not error then insert the new user in table users in db
    await supabase.from("users").insert({
      username,
      email,
    });

    // after inserting data into users table we get that record from users table by email
    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    // if value exists then assign the values to user which we use globally, we are taking the user records again its because the users table and authenticated tables are different.
    if (newUser) {
      user.value = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      };
    }

    // after successfull login also we want the login to be false
    loading.value = false;
  };

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    if (!validateEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }

    if (password.length < 0) {
      return (errorMessage.value = "Password must not be empty");
    }

    loading.value = true;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    // getting the user from users table and assigning the values to user which we use globally
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (existingUser) {
      user.value = {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      };
    }

    loading.value = false;
    errorMessage.value = "";
  };

  // logout the user and set the user object to null, which we use globally
  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  const getUser = async () => {
    loadingUser.value = true;
    // getting logged in user from supbase and storing in data
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }
    // if there is no logged in user then set loadingUser to false
    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    // getting user from user table to get its username, email and id and storing the data from response into userWithEmail
    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

      if (!userWithEmail) {
        loadingUser.value = false;
        return (user.value = null);
      }
    // setting the user data which we access in the project and imported from userstore
    user.value = {
      id: userWithEmail.id,
      username: userWithEmail.username,
      email: userWithEmail.email,
    };

    loadingUser.value = false;
  };

  const clearErrorMessage = () => {
    errorMessage.value = "";
  };

  return {
    user,
    errorMessage,
    loading,
    loadingUser,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMessage,
  };
});
