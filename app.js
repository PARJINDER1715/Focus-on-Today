const goalContainer = document.querySelector('.appContainer');
const errorLable = document.querySelector('.error-lable');
const progessBar = document.querySelector('.progress-bar');
const goalLevel = document.querySelector('.progress-level');
const progressLable = document.querySelector('.progress-lable');
const addGoalBtn = document.getElementById('addGoalBtn');

const allQuotes = [
    "Raise the bar by completing your goals!",
    "Well begun is half done!",
    "Just a step away, keep going!",
    "Whoa! You just completed all the goals, time for chill :D",
];

// Initialize goals as array
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Function to create a new goal element
function createGoalElement(goal = {id: Date.now(), name: '', done: false}) {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-container';
    goalDiv.dataset.id = goal.id;

    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'custom-checkbox';
    checkboxDiv.innerHTML = '<img class="checkBoxDone" src="./img/donesign.svg" alt="">';
    checkboxDiv.addEventListener('click', function() {
        const goalId = parseInt(this.parentElement.dataset.id);
        const goal = goals.find(g => g.id === goalId);
        
        if (goal.name.trim()) {
            this.parentElement.classList.toggle('done');
            goal.done = !goal.done;
            updateProgress();
        } else {
            progessBar.classList.add('show-error');
        }
    });

    const input = document.createElement('input');
    input.className = 'goal-input';
    input.type = 'text';
    input.placeholder = 'Add New Goal...';
    input.value = goal.name;

    input.addEventListener('focus', () => {
        progessBar.classList.remove('show-error');
    });

    input.addEventListener('input', (e) => {
        const goalId = parseInt(e.target.parentElement.dataset.id);
        const goal = goals.find(g => g.id === goalId);
        
        if (goal.done) {
            e.target.value = goal.name;
            return;
        }
        
        goal.name = e.target.value;
        localStorage.setItem('goals', JSON.stringify(goals));
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-goal-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.addEventListener('click', () => deleteGoal(goal.id));

    goalDiv.append(checkboxDiv, input, deleteBtn);
    return goalDiv;
}

// Function to update progress
function updateProgress() {
    const completedCount = goals.filter(g => g.done).length;
    const totalCount = goals.length;
    
    goalLevel.style.width = `${totalCount > 0 ? (completedCount / totalCount * 100) : 0}%`;
    goalLevel.firstElementChild.innerText = `${completedCount}/${totalCount} Completed`;
    progressLable.innerText = allQuotes[Math.min(completedCount, allQuotes.length-1)];
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Function to delete a goal
function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    document.querySelector(`.goal-container[data-id="${id}"]`).remove();
    updateProgress();
}

// Initialize existing goals
function initGoals() {
    // Clear existing goals
    document.querySelectorAll('.goal-container').forEach(el => el.remove());
    
    // Add current goals
    goals.forEach(goal => {
        const goalEl = createGoalElement(goal);
        goalContainer.insertBefore(goalEl, document.querySelector('.quote'));
        
        // Set checkbox state if goal is done
        if (goal.done) {
            goalEl.classList.add('done');
        }
    });
    
    updateProgress();
}

// Add event listeners
addGoalBtn.addEventListener('click', () => {
    const newGoal = { id: Date.now(), name: '', done: false };
    goals.push(newGoal);
    const goalEl = createGoalElement(newGoal);
    goalContainer.insertBefore(goalEl, document.querySelector('.quote'));
    updateProgress();
});

// Initialize the app
initGoals();
