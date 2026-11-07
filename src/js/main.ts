import { checkAuth } from "../js/auth.svelte";
import Alert from "./alerts";

new Alert().init();
checkAuth();

// openUserMenu(".user__button");
