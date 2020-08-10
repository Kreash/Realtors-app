<template>
  <div>

    <v-data-table
      :headers="headers"
      :items="realtors"
      item-key="id"
      class="elevation-1"
      :search="search"
      loading="true"
      loading-text="Загрузка данных"
      @dblclick:row="editRealtor"
    >
      <template v-slot:top>

        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateRangeText"
                    label="Диапазон даты регистрации"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dates" range></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>

        <v-text-field v-model="search" label="Фильтр" class="mx-4"></v-text-field>

      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Форма изменения данных риэлтора</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="7" md="7">
                <v-text-field v-model="editedItem.surname" label="Фамилия"></v-text-field>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
              </v-col>
              <v-col cols="12" sm="7" md="7">
                <v-select
                  v-model="editedItem.subdivition"
                  :items="subdivitions"
                  :rules="[v => !!v || 'Выберите подразделение']"
                  label="Подразделение"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                <v-text-field disabled v-model="editedItem.id" label="ID"></v-text-field>
              </v-col>
              <v-col cols="12" sm="7" md="7">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="editedItem.registrationDate"
                      label="Дата регистрации"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="editedItem.registrationDate"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="saveEditingRealtor" text>Сохранить</v-btn>
          <v-btn color="blue darken-1" @click="dialog = false" text>Отмена</v-btn>
          <v-btn color="blue darken-1" @click="dialog2 = true" text>Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Удаление данных риэлтора</span>
        </v-card-title>

        <v-card-text>
          <v-container>Вы действительно хотите удалить данные выбранного риэлтора из базы данных?</v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" @click="deleteRealtor" text>Да</v-btn>
          <v-btn color="blue darken-1" @click="dialog2 = false" text>Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">

// @ is an alias to /src
import Vue from "vue";
import firebase from "firebase/app";
import { bus } from "@/service/bus.ts";
import { Realtor } from '@/service/InterfaceManager.ts';

export default Vue.extend({
  data() {
    return {
      dates: [],
      menu1: false,
      menu2: false,
      dialog: false,
      dialog2: false,
      search: "",
      select: null,
      subdivitions: [
        "Первое подразделение",
        "Второе подразделение",
        "Третье подразделение",
        "Четвертое подразделение",
        "Пятое подразделение",
      ],
      realtors: [] as Realtor[],
      editedItem: {} as Realtor,
      picker: new Date().toISOString().substr(0, 10),
    };
  },
  computed: {
    headers() {
      return [
        { text: "ID", value: "id" },
        { text: "Фамилия", value: "surname" },
        { text: "Имя", value: "name" },
        { text: "Подразделение", value: "subdivition" },
        { text: "Дата регистрации", value: "registrationDate" },
      ];
    },
    dateRangeText() {
      this.filterOnDates();
      return this.$data.dates.join(" ~ ");
    },
  },
  created() {
    bus.$on("searchRealtor", (search: string) => {
      this.search = search;
    });
    this.gettingDataFromServer();
  },
  methods: {
    gettingDataFromServer() {
      firebase
        .database()
        .ref(`realtors`)
        .once("value")
        .then((snapshot) => {
          this.realtors = snapshot.val();
          this.realtors.forEach((el) => {
            const date = new Date(+el.registrationDate);
            el.registrationDate =
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate();
          });
        });
    },
    filterOnDates() {
      firebase
        .database()
        .ref(`realtors`)
        .once("value")
        .then((snapshot) => {
          this.realtors = snapshot.val();
          this.realtors.forEach((el) => {
            const date = new Date(+el.registrationDate);
            el.registrationDate =
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate();
          });

          const date1 = new Date(this.dates[0]);
          const date2 = new Date(this.dates[1]);
          this.realtors = this.realtors.filter((realtor) => {
            const date = new Date(+realtor.registrationDate);
            return date > date1 && date2 > date;
          });
        });
    },
    // eslint-disable-next-line
    editRealtor(event: any) {
      const id = event.path[1].childNodes[0].innerText;
      this.editedItem = JSON.parse(JSON.stringify(this.realtors[id]));
      this.dialog = true;
    },
    saveEditingRealtor() {
      const edRr = this.editedItem;

      firebase
        .database()
        .ref(`/realtors/${edRr.id}`)
        .set({
          id: edRr.id,
          guid: edRr.guid,
          surname: edRr.surname,
          name: edRr.name,
          subdivition: edRr.subdivition,
          registrationDate: new Date(edRr.registrationDate).getTime(),
        });
      this.dialog = false;
      this.gettingDataFromServer();
    },
    deleteRealtor() {
      const edRr = this.editedItem;
      firebase.database().ref(`/realtors/${edRr.id}`).remove();
      this.gettingDataFromServer();
      this.dialog2 = false;
      this.dialog = false;
    },
  },
});
</script>
