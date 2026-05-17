package spring.demo.services;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import spring.demo.models.Recipe;
import spring.demo.models.User;
import spring.demo.models.UserMealPlan;
import spring.demo.models.UserPreference;
import spring.demo.models.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import spring.demo.service.MealPlanService;

import java.time.LocalDate;
import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UnitTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Autowired
    private MealPlanService mealPlanService;

    @Test
    void checkUnitTypeGram() {
        String res = mealPlanService.getUnitType("200g");
        assertEquals("grams", res);
    }

    @Test
    void checkNoType() {
        String res = mealPlanService.getUnitType("5 oranges");
        assertEquals("count", res);
    }

    @Test
    void checkUserProgress() {
        User testUser = new User();
        testUser.setEmail("test@example.com");
        UserPreference pref = new UserPreference();
        pref.setMeals(3);
        pref.setCalories(2000);
        pref.setBudget(100.0);
        testUser.setPreferences(pref);
        testUser.setMealPlans(new ArrayList<>());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        assertEquals(0, mealPlanService.getProgress(testUser));
    }

    @Test
    void shouldRemoveDuplicateUnplannedMealsSuccessfully() {
        Recipe recipe = new Recipe();
        recipe.setId(1L);
        recipe.setName("Beef Stroganoff");

        UserMealPlan plannedMeal = new UserMealPlan();
        plannedMeal.setId(1L);
        plannedMeal.setRecipe(recipe);
        plannedMeal.setPlanned(true);

        UserMealPlan unplannedDuplicate = new UserMealPlan();
        unplannedDuplicate.setId(2L);
        unplannedDuplicate.setRecipe(recipe);
        unplannedDuplicate.setPlanned(false);

        User user = new User();
        user.setMealPlans(new ArrayList<>(List.of(plannedMeal, unplannedDuplicate)));
        mealPlanService.removeDuplicates(user, List.of(plannedMeal));

        assertEquals(1, user.getMealPlans().size());
        assertTrue(user.getMealPlans().get(0).isPlanned());
        assertEquals(1L, user.getMealPlans().get(0).getId());
    }

    @Test
    void shouldNotRemoveNonDuplicateMeals() {
        Recipe recipe1 = new Recipe(); recipe1.setId(1L); recipe1.setName("Beef Stroganoff");
        Recipe recipe2 = new Recipe(); recipe2.setId(2L); recipe2.setName("Chicken Tikka");

        UserMealPlan meal1 = new UserMealPlan(); meal1.setId(1L); meal1.setRecipe(recipe1); meal1.setPlanned(true);
        UserMealPlan meal2 = new UserMealPlan(); meal2.setId(2L); meal2.setRecipe(recipe2); meal2.setPlanned(false);

        User user = new User();
        user.setMealPlans(new ArrayList<>(List.of(meal1, meal2)));
        mealPlanService.removeDuplicates(user, List.of(meal1));

        assertEquals(2, user.getMealPlans().size());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldReturnTwoRandomRecipes() {
        List<Recipe> recipeList = mealPlanService.random();
        assertEquals(2, recipeList.size());
    }

    // ── isPoolExhausted ───────────────────────────────────────────────────

    @Test
    void isPoolExhausted_returnsFalse_whenNoMealPlans() {
        User user = buildUser(null);
        user.setMealPlans(new ArrayList<>());
        assertFalse(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsTrue_whenEntirePoolEaten() {
        User user = buildUser(null);
        user.setMealPlans(new ArrayList<>(List.of(eatenPlanned(), eatenPlanned())));
        assertTrue(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsFalse_whenPlannedAllEaten_butUneatenRowsRemainInPool() {
        // Simulates: today's 3 planned meals all eaten, but rest of weekly pool still available
        User user = buildUser(null);
        user.setMealPlans(new ArrayList<>(List.of(
                eatenPlanned(),
                eatenPlanned(),
                uneatenUnplanned()
        )));
        assertFalse(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsFalse_whenSomeMealsNotEaten() {
        User user = buildUser(null);
        user.setMealPlans(new ArrayList<>(List.of(eatenPlanned(), uneatenPlanned())));
        assertFalse(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsTrue_whenSevenDaysElapsed() {
        User user = buildUser(LocalDate.now().minusDays(7));
        user.setMealPlans(new ArrayList<>(List.of(uneatenPlanned())));
        assertTrue(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsFalse_whenSixDaysElapsed() {
        User user = buildUser(LocalDate.now().minusDays(6));
        user.setMealPlans(new ArrayList<>(List.of(uneatenPlanned())));
        assertFalse(mealPlanService.isPoolExhausted(user));
    }

    @Test
    void isPoolExhausted_returnsFalse_whenNullTimestampAndMealsNotAllEaten() {
        User user = buildUser(null);
        user.setMealPlans(new ArrayList<>(List.of(uneatenPlanned())));
        assertFalse(mealPlanService.isPoolExhausted(user));
    }

    // ── applyRepeatCap ────────────────────────────────────────────────────

    @Test
    void applyRepeatCap_keepsAllFreshRecipes() {
        ArrayList<Recipe> pool = buildRecipes(10, 100);
        Set<Long> seen = Set.of(200L, 201L); // none overlap
        ArrayList<Recipe> result = mealPlanService.applyRepeatCap(pool, seen, 6);
        assertEquals(10, result.size(), "All fresh recipes kept when no overlap");
    }

    @Test
    void applyRepeatCap_capsRepeatsAtMaxRepeats() {
        ArrayList<Recipe> pool = new ArrayList<>();
        pool.addAll(buildRecipes(5, 1));   // IDs 1-5  fresh
        pool.addAll(buildRecipes(10, 10)); // IDs 10-19 repeats
        Set<Long> seen = new HashSet<>();
        for (long id = 10; id <= 19; id++) seen.add(id);

        ArrayList<Recipe> result = mealPlanService.applyRepeatCap(pool, seen, 6);

        long repeatCount = result.stream().filter(r -> seen.contains(r.getId())).count();
        long freshCount  = result.stream().filter(r -> !seen.contains(r.getId())).count();

        assertEquals(5, freshCount,  "All 5 fresh recipes should be present");
        assertEquals(6, repeatCount, "Repeats capped at 6");
        assertEquals(11, result.size());
    }

    @Test
    void applyRepeatCap_allowsFewerThanMaxRepeats() {
        ArrayList<Recipe> pool = new ArrayList<>();
        pool.addAll(buildRecipes(4, 1));
        pool.addAll(buildRecipes(3, 10));
        Set<Long> seen = Set.of(10L, 11L, 12L);

        ArrayList<Recipe> result = mealPlanService.applyRepeatCap(pool, seen, 6);

        long repeatCount = result.stream().filter(r -> seen.contains(r.getId())).count();
        assertEquals(3, repeatCount, "All 3 repeats kept when under the cap");
        assertEquals(7, result.size());
    }

    @Test
    void applyRepeatCap_returnsUnchangedWhenSeenIdsEmpty() {
        ArrayList<Recipe> pool = buildRecipes(5, 1);
        ArrayList<Recipe> result = mealPlanService.applyRepeatCap(pool, new HashSet<>(), 6);
        assertEquals(5, result.size(), "No change when seen set is empty");
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private User buildUser(LocalDate lastGenerated) {
        User u = new User();
        u.setMealPlans(new ArrayList<>());
        u.setLastMealPlanGeneratedAt(lastGenerated);
        UserPreference pref = new UserPreference();
        pref.setMeals(3);
        pref.setCalories(2000);
        pref.setBudget(100.0);
        u.setPreferences(pref);
        return u;
    }

    private UserMealPlan eatenPlanned() {
        Recipe r = new Recipe();
        r.setId(Math.abs(new Random().nextLong()) + 1);
        UserMealPlan mp = new UserMealPlan();
        mp.setRecipe(r);
        mp.setPlanned(true);
        mp.setEaten(true);
        return mp;
    }

    private UserMealPlan uneatenPlanned() {
        Recipe r = new Recipe();
        r.setId(Math.abs(new Random().nextLong()) + 1);
        UserMealPlan mp = new UserMealPlan();
        mp.setRecipe(r);
        mp.setPlanned(true);
        mp.setEaten(false);
        return mp;
    }

    /** Row still in the weekly pool but not part of today's planned set */
    private UserMealPlan uneatenUnplanned() {
        Recipe r = new Recipe();
        r.setId(Math.abs(new Random().nextLong()) + 1);
        UserMealPlan mp = new UserMealPlan();
        mp.setRecipe(r);
        mp.setPlanned(false);
        mp.setEaten(false);
        return mp;
    }

    private ArrayList<Recipe> buildRecipes(int count, long startId) {
        ArrayList<Recipe> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            Recipe r = new Recipe();
            r.setId(startId + i);
            r.setName("Recipe-" + (startId + i));
            r.setCalories(400);
            list.add(r);
        }
        return list;
    }
}
