<script setup>
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar'
import { fetchData } from "@/helpers/index.js"
import router from "@/router"

const $q = useQuasar()

const baseUrl = `https://movies-g3fah0g2ggajgkcw.westeurope-01.azurewebsites.net/api/movies`
const movies = ref([])
const loadingStatesEdit = ref({});
const loadingStatesDelete = ref({});
const itemCurrentlyEdited = ref(false);
const itemCurrentlyCreated = ref(false);
const titleAdd = ref("")
const synopsisAdd = ref("")
const posterAdd = ref("")
const dateAdd = ref("")
const titleEdit = ref("")
const synopsisEdit = ref("")
const posterEdit = ref("")
const dateEdit = ref("")
const currentEditedMovieId = ref('')
const currentAddedMovie = ref({})
const currentlySorting = ref(false)
const optionsSelectSort = [
    "Popularité (par défaut)",
    "Titre",
    "Note moyenne",
    "Sortie"
]
const modelSelectSort = ref(optionsSelectSort[0])
const iconSortValues = ["arrow_downward", "arrow_upward"]
const iconSortRef = ref(iconSortValues[0])

onMounted(
    async () => {
        await fetchData(baseUrl, "GET", {}, {})
            .then(
                result => {
                    const unorderedData = result
                    unorderedData.sort((elt1, elt2) => elt2.popularity - elt1.popularity)
                    movies.value = unorderedData
                }
            )
            .catch(error => {
                console.log(error.message)
            })
    }
)

const handleSessionExpired = () => {
    $q.notify({
        message : "Session expired",
        tmeout : 3000
    })
    $q.loading.show()
    setTimeout(() => {
            router.push("/auth")
            $q.loading.hide()
        }, 1000
    )
}

const alertBeforeAction = async (message, handler, handlerParams = []) => {
    $q.dialog({
        title: "Information",
        message: message,
        cancel: true,
        persistent: true
    }).onOk(() => {
        handler(...handlerParams)
    }).onCancel(() => {
    }).onDismiss(() => {
    })
}


const editMovie = (currentMovie) => {
    currentEditedMovieId.value = currentMovie.id
    itemCurrentlyEdited.value = true
    titleEdit.value = currentMovie.title
    synopsisEdit.value = currentMovie.summary
    posterEdit.value = currentMovie.poster
    dateEdit.value = currentMovie.releaseDateYMD
}

const handleCancelEdit = () => {
    titleEdit.value = ""
    synopsisEdit.value = ""
    posterEdit.value = ""
    dateEdit.value = ""
    currentEditedMovieId.value = ''
    itemCurrentlyEdited.value = false
}

const handleCancelAdd = () => {
    itemCurrentlyCreated.value = false
    titleAdd.value = ""
    synopsisAdd.value = ""
    posterAdd.value = ""
    dateAdd.value = ""
    currentAddedMovie.value = {}
}

const handleCancelSort = () => {
    currentlySorting.value = false
    modelSelectSort.value = optionsSelectSort[0]
    iconSortRef.value = iconSortValues[0]
}

const sortByOption = async(option, order) => {
    switch(option) {
        case "Popularité (par défaut)":
            if(order === "arrow_downward"){
                movies.value.sort((elt1, elt2) => elt2.popularity - elt1.popularity)
            }
            else {
                movies.value.sort((elt1, elt2) => elt1.popularity - elt2.popularity)
            }
            break

        case "Titre":
            movies.value.sort((elt1, elt2) => {
                const elt1Lower = elt1.title.toLowerCase()
                const elt2Lower = elt2.title.toLowerCase()
                if(order === "arrow_downward"){
                    if(elt1Lower > elt2Lower) return -1
                    else if(elt1Lower < elt2Lower) return 1
                    else return 0
                }
                else {
                    if(elt1Lower > elt2Lower) return 1
                    else if(elt1Lower < elt2Lower) return -1
                    else return 0
                }
            })
            break
            
        case "Note moyenne":
            if(order === "arrow_downward"){
                movies.value.sort((elt1, elt2) => elt2.averageRating - elt1.averageRating)
            }
            else {
                movies.value.sort((elt1, elt2) => elt1.averageRating - elt2.averageRating)
            }
            break

        case "Sortie":
            movies.value.sort((elt1, elt2) => {
                if(order === "arrow_downward"){
                    if(elt1.releaseDateYMD > elt2.releaseDateYMD) return -1
                    else if(elt1.releaseDateYMD < elt2.releaseDateYMD) return 1
                    else return 0
                }
                else {
                    if(elt1.releaseDateYMD > elt2.releaseDateYMD) return 1
                    else if(elt1.releaseDateYMD < elt2.releaseDateYMD) return -1
                    else return 0
                }
            })
            break

        default:
            console.log("Option de tri non reconnue");
    }

}

const confirmSortMovie = async () => {
    const option = modelSelectSort.value
    const order = iconSortRef.value
    
    await sortByOption(option, order)
        .then(
            () => {
            }
        )
        .catch(error => {
            console.log(error.message)
        })
        .finally(() => {
            $q.loading.show()
            handleCancelSort()
            setTimeout(
                () => {
                    $q.loading.hide()
                }, 1000
            )
        });
    
}

const confirmAddMovie = async () => {
    const newData = {
        title: titleAdd.value,
        summary: synopsisAdd.value,
        poster: posterAdd.value,
        releaseDateYMD: dateAdd.value,
    }
    await fetchData(baseUrl, "POST", { 'Authorization': `Bearer ${ JSON.parse(sessionStorage.getItem('tokenMovies')).value }` }, newData) 
        .then(
            result => {
                if (result.response === "created") {
                    setTimeout(
                        () => {
                            const toAdd = {}

                            if(newData.releaseDateYMD !== null && newData.releaseDateYMD !== "") {
                                toAdd.releaseDate = new Date(newData.releaseDateYMD).toLocaleString("fr-FR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                            }
                            else toAdd.releaseDate = "N/A"
                            movies.value.unshift({
                                ...newData,
                                ...toAdd,
                                popularity : 0,
                                averageRating : 0.0,
                                votingPeople : 0
                            });

                        }, 1000
                    )
                }
                else throw new Error(result.error)
            }
        )
        .catch(error => {
            if(error.message === "Session expired") handleSessionExpired()
            console.log(error.message)
        })
        .finally(() => {
            $q.loading.show()
            handleCancelAdd()
            setTimeout(
                () => {
                    $q.loading.hide()
                }, 1000
            )
        });
}

const confirmEditMovie = async (id) => {
    loadingStatesEdit.value[id] = true
    const newData = {
        title: titleEdit.value,
        summary: synopsisEdit.value,
        poster: posterEdit.value,
        releaseDateYMD: dateEdit.value,
    }
    await fetchData(baseUrl + "/" + id, "PUT", { 'Authorization': `Bearer ${ JSON.parse(sessionStorage.getItem('tokenMovies')).value }` }, newData) 
        .then(
            result => {
                if (result.response === "updated") {
                    setTimeout(
                        () => {
                            const index = movies.value.findIndex(movie => movie.id === id);
                            const toEdit = {}
                            if(newData.releaseDateYMD !== null && newData.releaseDateYMD !== "") {
                                toEdit.releaseDate = new Date(newData.releaseDateYMD).toLocaleString("fr-FR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                            }
                            else toEdit.releaseDate = "N/A"
                            movies.value[index] = {
                                ...movies.value[index], // Conserver les propriétés existantes
                                ...newData,
                                ...toEdit
                            };

                        }, 500
                    )
                }
                else throw new Error(result.error)
            }
        )
        .catch(error => {
            if(error.message === "Session expired") handleSessionExpired()
            console.log(error.message)
        })
        .finally(() => {
            setTimeout(
                () => {
                    handleCancelEdit()
                    delete loadingStatesEdit.value[id];
                }, 500
            )
        });
}


const deleteMovie = async (id) => {
    loadingStatesDelete.value[id] = true
    await fetchData(baseUrl + "/" + id, "DELETE", { 'Authorization': `Bearer ${ JSON.parse(sessionStorage.getItem('tokenMovies')).value }` }, {})
        .then(
            result => {
                console.log(result)
                if (result.response === "deleted") {
                    setTimeout(
                        () => {
                            movies.value = movies.value.filter(movie => movie.id !== id);
                        }, 500
                    )
                }
                else throw new Error(result.error)
            }
        )
        .catch(error => {
            if(error.message === "Session expired") handleSessionExpired()
            console.log(error.message)
        })
        .finally(() => {
            setTimeout(
                () => {
                    delete loadingStatesDelete.value[id]; // Désactiver le loader après la suppression
                }, 500
            )
        });
}

</script>

<template>
    <h2 class="text-center q-mt-xl q-pt-xl">Au cinéma en ce moment</h2>

    <q-btn label="Ajouter un film" color="primary" class="q-mb-md" @click="itemCurrentlyCreated = true" style="margin-left : 65px;" glossy push  :class="{ disabled : itemCurrentlyCreated }"/>
    <q-btn color="black" icon="sort" label="Trier" class="q-mb-md q-ml-md" glossy push @click="currentlySorting = ! currentlySorting"/>

    <!-- TRI -->
    <div v-if="currentlySorting">
        <q-form class="q-mb-xl" style="margin-left : 65px;"
            @submit.prevent="confirmSortMovie">

            <span style="display: flex; align-items: center;" class="q-gutter-x-md">
                <q-select filled v-model="modelSelectSort" :options="optionsSelectSort" label="Options de tri" style="width : 220px;"/>
                <q-btn color="black" round glossy push :icon="iconSortRef" @click="iconSortRef = iconSortValues[ (iconSortValues.indexOf(iconSortRef) + 1) % 2 ]" />
                <q-btn label="Annuler" color="negative" @click="handleCancelSort" />
                <q-btn label="Valider" color="primary" type="submit" />
            </span>
        </q-form>

        <q-separator inset color="grey" size="2px" class="q-mb-xl" />
    </div>

    
    <!-- ADD -->
    <div class="q-mx-xl" v-if="itemCurrentlyCreated">
        <h5 class="q-mb-md">Ajouter un film</h5>
        <q-form class="q-mb-xl"
            @submit.prevent="alertBeforeAction('Vous voulez vraiment ajouter ce film?', confirmAddMovie, []);">
            <div class="q-gutter-md row items-start q-mb-lg">
                <q-input filled v-model="titleAdd" label="Titre" class="inputForm" />
                <q-input filled v-model="synopsisAdd" label="Synopsis" type="textarea"
                    style="width: 400px; max-height: 200px;" />
                <q-input filled v-model="posterAdd" label="Poster" class="inputForm" />
                <q-input v-model="dateAdd" filled type="date" label="Date de sortie" class="inputForm" />
            </div>
            <div class="q-gutter-md">
                <q-btn label="Annuler" color="negative" @click="handleCancelAdd" />
                <q-btn label="Valider" color="primary" type="submit" />
            </div>
        </q-form>

        <q-separator inset color="grey" size="2px" class="q-mb-xl" />
    </div>

    <!-- EDIT -->
    <div class="q-mx-xl" v-if="itemCurrentlyEdited">
        <h5 class="q-mb-md">Modifier ce film</h5>
        <q-form class="q-mb-xl"
            @submit.prevent="alertBeforeAction('Vous voulez vraiment modifier ce film?', confirmEditMovie, [currentEditedMovieId])">
            <div class="q-gutter-md row items-start q-mb-lg">
                <q-input filled v-model="titleEdit" label="Titre" class="inputForm" />
                <q-input filled v-model="synopsisEdit" label="Synopsis" type="textarea"
                    style="width: 400px; max-height: 200px;" />
                <q-input filled v-model="posterEdit" label="Poster" class="inputForm" />
                <q-input v-model="dateEdit" filled type="date" label="Date de sortie" class="inputForm" />
            </div>
            <div class="q-gutter-md">
                <q-btn label="Annuler" color="negative" @click="handleCancelEdit" />
                <q-btn label="Valider" color="primary" type="submit" />
            </div>
        </q-form>

        <q-separator inset color="grey" size="2px" class="q-mb-xl" />
    </div>

    <div id="list-movies">
        <div class="row q-col-gutter-md q-mx-xl">
            <div class="col-3 col-xl-2" v-for="movie in movies">
                <div>
                    <q-card :id="movie.id" :class="{ disabled: itemCurrentlyEdited }">
                        <q-img :src="movie.poster" style="max-height: 460px;">
                            <q-tooltip class="bg-transparent" :delay="500" anchor="center right" self="center left">
                                <q-card class="bg-grey-9 card-tooltip text-white" style="min-width: 350px;">
                                    <q-card-section>
                                        <div class="text-subtitle1 text-bold">Synopsis</div>
                                    </q-card-section>

                                    <q-separator inset color="white" />

                                    <q-card-section class="text-body2">
                                        {{ movie.summary }}
                                    </q-card-section>
                                </q-card>
                            </q-tooltip>
                        </q-img>

                        <q-card-section>
                            <div class="text-h6 text-bold movie-title">{{ movie.title }}</div>
                            <div class="text-subtitle1">Sortie : <b>{{ movie.releaseDate }}</b></div>
                            <span style="display: flex; align-items: center;">
                                <q-icon name="star" color="warning" size="sm" />
                                <p class="text-body1"
                                    style="margin: 0; display: inline; padding-left: 4px; line-height: 1;">
                                    <b>{{ !!movie.averageRating ? movie.averageRating.toFixed(2) + " / 10" : "N/A"
                                        }}</b> ( {{ movie.votingPeople }} votes )
                                </p>
                            </span>
                            <span style="display: flex; align-items: center;">
                                <q-icon name="visibility" color="black" size="sm" />
                                <p class="text-body1"
                                    style="margin: 0; display: inline; padding-left: 4px; line-height: 1;">
                                    <b>{{ movie.popularity }}</b> personnes
                                </p>
                            </span>
                            <div class="q-gutter-x-sm">
                                <q-btn color="primary" icon="edit" round glossy push @click="editMovie(movie)" />
                                <q-btn color="negative" icon="delete" round glossy push
                                    @click="alertBeforeAction('Vous voulez vraiment supprimer ce film?', deleteMovie, [movie.id])" />
                            </div>
                        </q-card-section>
                        <q-inner-loading :showing="!!loadingStatesDelete[movie.id]" label="En cours de suppression"
                            label-class="text-black text-body2 text-bold" />
                        <q-inner-loading :showing="!!loadingStatesEdit[movie.id]" label="En cours de modification"
                            label-class="text-black text-body2 text-bold" />
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.movie-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-tooltip {
    width: 100%;
    max-width: 250px;
}

.inputForm {
    max-width: 300px;
}
</style>