import { createStore } from "vuex";

const ridingClasses = {
  "Class 1": "Introductory Equitation",
  "Class 2A": "Pre-Novice Equitation",
  "Class 2B": "Novice Equitation",
  "Class 3": "Limit Equitation on the Flat",
  "Class 4": "Limit Equitation over Fences",
  "Class 5": "Intermediate Equitation on the Flat",
  "Class 6": "Intermediate Equitation over Fences",
  "Class 7": "Open Equitation on the Flat",
  "Class 8": "Open Equitation over Fences",
  "Class 9": "Alumni Equitation on the Flat",
  "Class 10": "Alumni Equitation over Fences",
  "Class 11": "Beginner Western Horsemanship",
  "Class 12A": "Rookie A Western Horsemanship",
  "Class 12B": "Rookie B Western Horsemanship",
  "Class 13": "Level I Western Horsemanship",
  "Class 14": "Level II Western Horsemanship",
  "Class 15": "Level II Ranch Riding",
  "Class 16": "Open Western Horsemanship",
  "Class 17": "Open Reining", 
  "Class 18": "Alumni Western Horsemanship",
  "Class 19": "Alumni Ranch Riding"
}

export const store = createStore({
  state() {
    return {
      eventRiders: {},
      eventHorses: {},
      eventClasses: {},
      classToName: ridingClasses
    };
  }
});
