import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";

function Home({ habits, onAddHabit }) {
  return (
    <div>
      <HabitForm onAddHabit={onAddHabit} />
      <HabitList habits={habits} />
    </div>
  );
}

export default Home;
