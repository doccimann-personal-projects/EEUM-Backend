export class recommendedFoods {
  recommendedFoodList: Array<toIntRecommendedFoods>;

  constructor(recommendedFoodList: Array<toIntRecommendedFoods>) {
    this.recommendedFoodList = recommendedFoodList;
  }

  static fromEntity(
    recommendedFood: Array<toRecommendedFoods>,
  ): Array<toIntRecommendedFoods> {
    const recommendedFoodList: Array<toIntRecommendedFoods> =
      recommendedFood.reduce(
        (map: Array<toIntRecommendedFoods>, value: toRecommendedFoods) => {
          const obj: toIntRecommendedFoods = {
            id: Number(value['id']),
            foodName: value['foodName'],
            createdAt: value['createdAt'],
          };
          map.push(obj);
          return map;
        },
        [],
      );
    return recommendedFoodList;
  }
}

export interface toRecommendedFoods {
  id: bigint;
  foodName: string;
  createdAt: Date;
}

export interface toIntRecommendedFoods {
  id: number;
  foodName: string;
  createdAt: Date;
}
