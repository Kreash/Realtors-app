<template>
  <div>
    <div>Форма добавления нового риэлтора</div>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
      <v-text-field v-model="name" :rules="nameRules" label="Имя" required></v-text-field>

      <v-text-field v-model="surname" :rules="nameRules" label="Фамилия" required></v-text-field>

      <v-select
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Выберите подразделение']"
        label="Подразделение"
        required
      ></v-select>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="createRealtor"
      >Добавить риэлтора</v-btn>

      <v-btn color="error" class="mr-4" @click="reset">Сбросить форму</v-btn>
    </v-form>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline lighten-2">Риэлтор успешно добавлен</v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">I accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase from 'firebase/app'
import { Realtor } from '@/service/InterfaceManager.ts';

export default Vue.extend({
      data: () => ({
      valid: false,
      name: '',
      surname: '',
      nameRules: [
        (v: string) => !!v || 'Поле не может быть пустым',
      ],
      select: null,
      items: [
      'Первое подразделение',
      'Второе подразделение',
      'Третье подразделение',
      'Четвертое подразделение',
      'Пятое подразделение',
      ],
      checkbox: false,
      lazy: false,


      dialog: false,
      returnId: 999,
    }),
  filters: {
    date(value: number){
      const date = new Date(value)
      return date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate()
       + ' ' + date.getHours()+ ':' + date.getMinutes();
    }
  },
    methods: {
      createRealtor () {
        // eslint-disable-next-line
        (this.$refs.form as any).validate()
        if (this.valid) {

          firebase.database().ref(`realtors`).once('value').then((snapshot) => {
            const realtors = snapshot.val();
            if (realtors !== null) {
              const idArr = realtors.map((realtor: Realtor) => {
                return realtor.id;
              });
              let previousKey = -1;
              for (const key in idArr){
                if(previousKey + 1 !== +key){
                  this.returnId = previousKey + 1;
                  break;
                }
                previousKey = +key;
                this.returnId = +key + 1;
              }
              this.cr();
            } else {
            this.returnId = 0;
            this.cr();
            }


          });


        }
        this.dialog = true;
      },
      cr() {
            firebase.database().ref(`/realtors/${this.returnId}`).set({
            id: this.returnId, guid: this.returnId, surname: this.surname, name: this.name, 
            subdivition: this.select, registrationDate: Date.now()
            });
            // eslint-disable-next-line
            (this.$refs.form as any).reset()
      },
      reset () {
        // eslint-disable-next-line
        (this.$refs.form as any).reset()
      },
    },



})
</script>