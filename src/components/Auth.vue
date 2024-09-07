<script setup>
import { ref } from "vue"
import { fetchData } from "@/helpers/index.js"
import router from "@/router"
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isPwd = ref(true)
const username = ref("")
const password = ref("")
const message = ref("")

async function signIn() {
    await fetchData("https://movies-g3fah0g2ggajgkcw.westeurope-01.azurewebsites.net/api/login", "POST", {}, {
        username: username.value,
        password: password.value
    }).then(response => {
        sessionStorage.setItem("tokenMovies", JSON.stringify({ value : response}))
        message.value = "You are connected !"

        setTimeout(
            () => {
                $q.loading.show()
                setTimeout(() => {
                        router.push("/")
                        $q.loading.hide()
                    }, 1000
                )
            }, 1000
        )
    }).catch(error => {
        message.value = error.message == 404 ? "Username or password incorrect! Try again" : error.message
    })
}
</script>

<template>
    <div class="row justify-center" style="margin-top : 150px">
        <div class="col-4 col-xl-3">
            <q-card class="text-white" style="background-color : #1F2F3F">
                <q-card-section>
                    <div class="text-h6 text-center">Se connecter</div>
                </q-card-section>
                <q-card-section>
                    <q-form class="q-mb-xl" style="margin-left : 65px;" @submit.prevent="signIn()">
                        <q-input dark class="q-mb-lg" outlined v-model="username" label="Username"
                            style="max-width:350px;" />
                        <q-input dark class="q-mb-lg" :type="isPwd ? 'password' : 'text'" outlined v-model="password"
                            label="Password" style="max-width:350px;">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>
                        <q-btn label="Valider" color="primary" type="submit" />
                        <p class="text-subtitle-1 text-bold q-mt-md" v-show="message !== ''"
                            :class="[ message === 'You are connected !' ? 'text-positive' : 'text-negative']">{{ message}}
                        </p>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<style scoped></style>