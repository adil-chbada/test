<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs8>
            <v-card class="elevation-12">
              <!-- TOOLBAR -->
              <v-toolbar color="primary" dark tabs>
                <v-toolbar-title>
                  Vue School - Firebase Authentication
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip v-if="signedIn" left>
                  <v-btn icon slot="activator" @click="signOut">
                    <v-icon>lock</v-icon>
                  </v-btn>
                  <span>Sign out</span>
                </v-tooltip>
                <v-tooltip v-if="!signedIn" left>
                  <v-btn icon slot="activator" @click="goToSignIn">
                    <v-icon>lock_open</v-icon>
                  </v-btn>
                  <span>Sign in</span>
                </v-tooltip>
                <!-- TABS -->
                <v-tabs slot="extension" v-model="activeTab" dark centered grow color="primary">
                  <v-tabs-slider color="accent" style="height: 6px"></v-tabs-slider>
                  <v-tab v-if="signedIn" href="#currentUserTab">
                    <span class="d-inline-flex align-center">
                      <v-icon medium class="mr-2">face</v-icon>
                      Current User                    
                    </span>
                  </v-tab>
                  <v-tab v-if="signedIn" href="#updateUserTab">
                    <span class="d-inline-flex align-center">
                      <v-icon medium class="mr-2">create</v-icon>
                      Update User
                    </span>
                  </v-tab>
                  <v-tab v-if="!signedIn" href="#signInTab">
                    <span class="d-inline-flex align-center">
                      <v-icon medium class="mr-2">vpn_key</v-icon>
                      Sign In
                    </span>
                  </v-tab>
                  <v-tab href="#registerTab">
                    <span class="d-inline-flex align-center">
                      <v-icon medium class="mr-2">account_circle</v-icon>
                      Register
                    </span>
                  </v-tab>
                </v-tabs>
              </v-toolbar>
              <!-- TAB ITEMS -->
              <v-tabs-items v-model="activeTab">
                <!-- CURRENT USER TAB -->
                <v-tab-item v-if="signedIn" id="currentUserTab">
                  <v-card flat>
                    <v-card-text>
                      Hi {{userDisplayName}}!
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- UPDATE USER TAB -->
                <v-tab-item v-if="signedIn" id="updateUserTab">
                  <v-card flat>
                    <v-card-text>
                      Update User Tab Item - {{activeTab}}
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- SIGN-IN TAB -->
                <v-tab-item v-if="!signedIn" id="signInTab">
                  <v-card flat>
                    <v-card-text>
                      <h3 class="d-inline-flex align-center primary--text">
                        <v-icon color="primary" class="mr-2">mail_outline</v-icon>
                        Sign in with e-mail
                      </h3>
                      <v-form ref="signInForm" v-model="signInFormValid">
                        <v-text-field 
                          ref="signInEmail" 
                          label="E-mail" 
                          hint="Required, must be valid e-mail address."
                          v-model="credentials.email" 
                          required
                          :rules="validationRules.email">
                        </v-text-field>
                        <v-text-field
                          label="Password"
                          hint="Required, minimum length 8 characters."
                          v-model="credentials.password"
                          required 
                          counter
                          :rules="validationRules.password"
                          :append-icon="showSignInPassword ? 'visibility_off' : 'visibility'"
                          :type="showSignInPassword ? 'text' : 'password'"
                          @click:append="showSignInPassword = !showSignInPassword">
                        </v-text-field>
                        <div class="mt-2">
                          <v-btn color="primary" :disabled="!signInFormValid" class="ml-0" @click="signInWithEmail">
                            Sign in
                          </v-btn>
                          <v-btn @click="resetSignInForm">Reset Form</v-btn>
                        </div>
                      </v-form>
                      <h4 class="mt-4 mb-2 accent--text">
                        Or, sign in with a third-party provider:
                      </h4>
                      <v-tooltip bottom>
                        <v-btn small fab dark slot="activator" color="primary" @click="signInWithGoogle">
                          <v-icon>mdi-google</v-icon>
                        </v-btn>
                        <span>Sign in with Google</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn small fab dark slot="activator" color="primary" @click="signInWithGitHub">
                          <v-icon>mdi-github-circle</v-icon>
                        </v-btn>
                        <span>Sign in with GitHub</span>
                      </v-tooltip>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- REGISTRATION TAB -->
                <v-tab-item id="registerTab">
                  <v-card flat>
                    <v-card-text>
                      <h3 class="d-inline-flex align-center primary--text">
                        <v-icon color="primary" class="mr-2">mail_outline</v-icon>
                        Register with e-mail
                      </h3>
                      <v-form ref="registerForm" v-model="registerFormValid">
                        <v-text-field 
                          ref="registerEmail" 
                          label="E-mail" 
                          hint="Required, must be valid e-mail address."
                          v-model="credentials.email" 
                          required
                          :rules="validationRules.email">
                        </v-text-field>
                        <v-text-field
                          label="Password"
                          hint="Required, minimum length 8 characters."
                          v-model="credentials.password"
                          required 
                          counter
                          :rules="validationRules.password"
                          :append-icon="showRegisterPassword ? 'visibility_off' : 'visibility'"
                          :type="showRegisterPassword ? 'text' : 'password'"
                          @click:append="showRegisterPassword = !showRegisterPassword">
                        </v-text-field>
                        <div class="mt-2">
                          <v-btn color="primary" :disabled="!registerFormValid" class="ml-0" @click="registerWithEmail">
                            Register
                          </v-btn>
                          <v-btn @click="resetRegisterForm">Reset Form</v-btn>
                        </div>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar v-model="snackbarOptions.show" :color="snackbarOptions.color" :right="true" :bottom="true">
      {{ snackbarOptions.text }}
      <v-btn flat color="white" @click="snackbarOptions.show = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import * as firebase from "firebase";
  import { firebaseConfig } from './config';

  if (firebase.apps.length === 0)
    firebase.initializeApp(firebaseConfig)

  const auth = firebase.auth()

  const Tab = {
    CurrentUser: "currentUserTab",
    UpdateUser: "updateUserTab",
    SignIn: "signInTab",
    Register: "registerTab",
  }

  export default {
    name: "App",
    data() {
      return {
        activeTab: Tab.CurrentUser,
        Tab,
        signInFormValid: true,
        registerFormValid: true,
        showSignInPassword: false,
        showRegisterPassword: false,
        validationRules: {
          email: [
            v => !!v || "E-mail is required.",
            v => /.+@.+/.test(v) || "E-mail must be valid."
          ],
          password: [
            v => !!v || "Password is required.",
            v => (v || "").length > 7 || "Password must have a minimum of 8 characters.",
            v => (v || "").length < 16 || "Password must have a maximum of 15 characters."
          ]
        },
        snackbarOptions: {
          show: false,
          color: "info",
          text: ""
        },
        user: null,
        credentials: {
          email: "",
          password: ""
        },
        credentialUpdates: {
          email: "",
          password: ""
        },
        profileUpdates: {
          displayName: null,
          photoURL: null
        }
      }
    },
    // Example of filter usage. In templates, `{{ name | capitalize }}`
    filters: {
      capitalize(value) {
        if (!value)
          return ''

        value = value.toString()

        if (value.length === 1)
          return value.toUpperCase() 

        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },  
    computed: {
      signedIn() {
        return !!this.user
      },
      signInForm() {
        return this.$refs.signInForm
      },
      signInEmail() {
        return this.$refs.signInEmail
      },
      registerForm() {
        return this.$refs.registerForm
      },
      registerEmail() {
        return this.$refs.registerEmail
      },
      userEmail() {
        const providerData = [].concat(this.user && this.user.providerData)[0]
        return (this.user && this.user.email) || (providerData && providerData.email)
      },
      userDisplayName() {
        return this.user.displayName || 'friend'
      }
    },
    methods: {
      notify(type, message, additionalData = null) {
        const isError = /^error$/i.test(type)

        if (isError) {
          console.error(message)
        } else {
          console.info(message)
        }

        if (additionalData) {
          if (isError) {
            console.error('Additional error data:', additionalData)
          } else {
            console.info('Additional data:', additionalData)
          }
        }

        this.snackbarOptions = {
          show: true,
          color: type,
          text: message
        }
      },
      registerWithEmail() {
        if (this.registerForm.validate()) {
          const { email, password } = this.credentials
          auth.createUserWithEmailAndPassword(email, password).then(user => {
            this.notify('success', `Registration successful for '${this.credentials.email}'.`)
            this.resetSignInForm()
            this.resetRegisterForm()
          }).catch(error => {
            this.notify('error', error.message, error)
          })
        } else {
          this.notify("error", "Form inputs are invalid, please verify and try again.")
        }
      },
      // Example of invoking a filter from code. 
      capitalize(value) {
        return this.$options.filters.capitalize(value);
      },
      goToSignIn() {
        this.activeTab = Tab.SignIn
        // See https://vuejs.org/v2/api/#vm-nextTick
        this.$nextTick(() => this.signInEmail.focus())
      },
      resetRegisterForm() {
        this.registerForm.reset()
      },
      resetSignInForm() {
        this.signInForm.reset()
      },
      signInWithEmail() {
        if (this.signInForm.validate()) {
          const { email, password } = this.credentials
          auth.signInWithEmailAndPassword(email, password).then(user => {
            // See https://vuejs.org/v2/api/#vm-nextTick
            this.$nextTick(() => {
              console.info(">>> E-mail providerData:", this.user && this.user.providerData);
              this.activeTab = Tab.CurrentUser
              this.notify("success", `Signed in as '${this.userEmail}'.`, this.user)
            })
          }).catch(error => {
            this.notify("error", error.message, error)
          })
        } else {
          this.notify("error", "Form inputs are invalid, please verify and try again.")
        }
      },
      signInWithGoogle() {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(googleAuthProvider).then(response => {
          console.info(">>> Google providerData:", this.user && this.user.providerData);
          this.activeTab = Tab.CurrentUser
          this.notify("success", `Signed in with Google.`, response)
          // See https://vuejs.org/v2/api/#vm-nextTick
          // this.$nextTick(() => {})
        }).catch(error => {
          this.notify("error", `Error signing in with Google: ${error.message}`, error)
          this.user = null
        })
      },
      signInWithGitHub() {
        const githubAuthProvider = new firebase.auth.GithubAuthProvider()
        auth.signInWithPopup(githubAuthProvider).then(response => {
          console.info(">>> GitHub providerData:", this.user && this.user.providerData);
          this.activeTab = Tab.CurrentUser
          this.notify("success", `Signed in with GitHub.`, response)
        }).catch(error => {
          this.notify("error", `Error signing in with GitHub: ${error.message}`, error)
          this.user = null
        })            
      },
      signOut() {
        auth.signOut().then(() => {
          this.activeTab = this.Tab.SignIn
          this.notify("success", `Signed out.`)
        }).catch(error => {
          this.notify("error", error.message, error)
          this.user = null
        })
      },
      updateProfile() {
        // TODO: Try with auth.currentUser
        this.user.updateProfile(this.profileUpdates).then((data) => {
          console.log('data', data)
          this.notify('success', `Successfully updated the user.`)
        }).catch(error => {
          this.notify('error', error.message, error)
        })
      },
      updateEmail() {
        // TODO
      },
      updatePassword() {
        // TODO
      }
    },
    created() {
      this.notify("success", this.capitalize(`signed out.`)) 

      auth.onAuthStateChanged(user => {
        this.user = user || null

        if (this.user) {
          this.credentials = { email: '', password: '' }
          this.credentialUpdates.email = this.authUserEmail
          this.profileUpdates = { 
            displayName: this.user.displayName, 
            photoURL: this.user.photoURL 
          }
          console.log(user)
        } else {
          this.credentialUpdates = { email: '', password: '' }
          this.profileUpdates = { displayName: '', photoURL: '' }
        }
      })
    }
  }
</script>
