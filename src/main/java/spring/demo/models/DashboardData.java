package spring.demo.models;

import java.util.List;


public class DashboardData {
    private List<Recipe> selectedMeals;
    private List<Recipe> randomMeals;
    private List<Ingredient> groceryList;
    private Integer progress;
    private Integer budget;
    private int eaten; //total eaten
    private int target; //total cal
    private int remaining; //total meals remaining
    private boolean poolRefreshed;



    // Constructor, getters, setters
    public DashboardData(List<Recipe> selectedMeals, List<Recipe> randomMeals, List<Ingredient>
            groceryList, Integer progress, Integer budget, int eaten, int target, int remaining) {
        this.selectedMeals = selectedMeals;
        this.randomMeals = randomMeals;
        this.groceryList = groceryList;
        this.progress = progress;
        this.budget = budget;
        this.eaten = eaten;
        this.target = target;
        this.remaining = remaining;
        this.poolRefreshed = false;
    }

    public DashboardData(List<Recipe> selectedMeals, List<Recipe> randomMeals, List<Ingredient>
            groceryList, Integer progress, Integer budget, int eaten, int target, int remaining, boolean poolRefreshed) {
        this(selectedMeals, randomMeals, groceryList, progress, budget, eaten, target, remaining);
        this.poolRefreshed = poolRefreshed;
    }

    public List<Recipe> getSelectedMeals() { return selectedMeals; }
    public List<Recipe> getRandomMeals() { return randomMeals; }
    public List<Ingredient> getGroceryList() { return groceryList; }
    public Integer getProgress() { return progress; }
    public Integer getBudget() { return budget; }
    public int getEaten() {
        return eaten;
    }

    public void setEaten(int eaten) {
        this.eaten = eaten;
    }

    public int getTarget() {
        return target;
    }

    public void setTarget(int target) {
        this.target = target;
    }

    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }


    public void setProgress(int progress) {
        this.progress = progress;
    }

    public boolean isPoolRefreshed() {
        return poolRefreshed;
    }

    public void setPoolRefreshed(boolean poolRefreshed) {
        this.poolRefreshed = poolRefreshed;
    }

}