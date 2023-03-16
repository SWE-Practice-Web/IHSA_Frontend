import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      eventRiders: {
        "Class 11": [],
        "Class 12A": [],
        "Class 12B": [],
        "Class 13": [],
        "Class 14": [],
        "Class 15": [],
        "Class 16": [],
        "Class 17": [],
      },
      eventHorses: {
        "Class 11": [],
        "Class 12A": [],
        "Class 12B": [],
        "Class 13": [],
        "Class 14": [],
        "Class 15": [],
        "Class 16": [],
        "Class 17": [],
      },
      eventClasses: {
        "Class 11": [],
        "Class 12A": [],
        "Class 12B": [],
        "Class 13": [],
        "Class 14": [],
        "Class 15": [],
        "Class 16": [],
        "Class 17": [],
      },
      classToName: {
        "Class 11": "Beginner Western Horsemanship",
        "Class 12A": "Rookie A Western Horsemanship",
        "Class 12B": "Rookie B Western Horsemanship",
        "Class 13": "Level I Western Horsemanship",
        "Class 14": "Level II Western Horsemanship",
        "Class 15": "Level II Ranch Riding",
        "Class 16": "Open Western Horsemanship",
        "Class 17": "Open Reining",  
      }
    };
  }
});
