export type workout = {
  workout: string;
  reps: string;
};

export type bmiResult = {
  result: number;
  date: string;
};

export type Meal = {
  name: string;
  components: MealComponent[];
  timestamp: {
    day: number;
    month: number;
    year: number;
    hour: number;
  };
};

export type MealComponent = {
  name: string;
  amount: string;
  kcal: number;
};

export type availableComponent = {
  label: string;
  value: string;
  kcalPerG: number;
};

export type coordinates = { x: number; y: number; z: number };

export type cameraType = 1 | 0;

export type img = {
  uri: string;
};
