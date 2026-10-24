const MAX_IN_PROGRESS = 3;


const tasks = [

    {
        id: 1,
        title: "Buy train tickets",
        status: "todo",
        priority: 3,
        tag: "transport",
        cost: 28000,
        urgent: true,
        notes: ["Compare departure times"]
    },

    {
        id: 2,
        title: "Book hotel",
        status: "progress",
        priority: 3,
        tag: "stay",
        cost: 65000,
        urgent: true,
        notes: ["Check breakfast option"]
    },

    {
        id: 3,
        title: "Check visa requirements",
        status: "done",
        priority: 3,
        tag: "documents",
        cost: 0,
        urgent: true,
        notes: []
    },

    {
        id: 4,
        title: "Choose restaurants",
        status: "todo",
        priority: 1,
        tag: "activities",
        cost: 15000,
        urgent: false,
        notes: ["Save vegetarian options"]
    },

    {
        id: 5,
        title: "Pack luggage",
        status: "todo",
        priority: 2,
        tag: "packing",
        cost: 0,
        urgent: false,
        notes: ["Check weather"]
    },

    {
        id: 6,
        title: "Buy travel insurance",
        status: "progress",
        priority: 3,
        tag: "documents",
        cost: 12000,
        urgent: true,
        notes: []
    },

    {
        id: 7,
        title: "Plan museum visit",
        status: "todo",
        priority: 1,
        tag: "activities",
        cost: 8000,
        urgent: false,
        notes: ["Check opening hours"]
    },

    {
        id: 8,
        title: "Arrange airport transfer",
        status: "progress",
        priority: 2,
        tag: "transport",
        cost: 9000,
        urgent: false,
        notes: []
    },

    {
        id: 9,
        title: "Download offline maps",
        status: "done",
        priority: 2,
        tag: "activities",
        cost: 0,
        urgent: false,
        notes: []
    },

    {
        id: 10,
        title: "Prepare travel documents",
        status: "todo",
        priority: 3,
        tag: "documents",
        cost: 0,
        urgent: true,
        notes: [
            "Passport",
            "Tickets",
            "Insurance"
        ]
    }

];


const board =
    document.querySelector("#board");

const todoColumn =
    document.querySelector("#todoColumn");

const progressColumn =
    document.querySelector("#progressColumn");

const doneColumn =
    document.querySelector("#doneColumn");


const searchInput =
    document.querySelector("#searchInput");

const tagFilter =
    document.querySelector("#tagFilter");

const sortSelect =
    document.querySelector("#sortSelect");


const messageElement =
    document.querySelector("#message");

const emptyMessage =
    document.querySelector("#emptyMessage");


const completedCount =
    document.querySelector("#completedCount");

const totalBudget =
    document.querySelector("#totalBudget");

const progressBar =
    document.querySelector("#progressBar");

const progressText =
    document.querySelector("#progressText");


const todoCount =
    document.querySelector("#todoCount");

const progressCount =
    document.querySelector("#progressCount");

const doneCount =
    document.querySelector("#doneCount");


function getPriorityName(priority) {

    if (priority === 3) {
        return "High";
    }

    if (priority === 2) {
        return "Medium";
    }

    return "Low";

}


function createTaskCard(task) {

    const card =
        document.createElement("article");

    card.classList.add("task-card");

    card.dataset.id = task.id;


    if (task.urgent === true) {

        const urgent =
            document.createElement("span");

        urgent.classList.add("urgent");

        urgent.textContent = "Urgent";

        card.appendChild(urgent);

    }


    const title =
        document.createElement("h3");

    title.textContent = task.title;

    card.appendChild(title);


    const tag =
        document.createElement("p");

    tag.classList.add("task-tag");

    tag.textContent = task.tag;

    card.appendChild(tag);


    const priority =
        document.createElement("p");

    priority.classList.add("priority");

    priority.textContent =
        "Priority: "
        + getPriorityName(task.priority);

    card.appendChild(priority);


    const cost =
        document.createElement("p");

    cost.textContent =
        "Budget: "
        + task.cost
        + " ₸";

    card.appendChild(cost);


    if (task.notes.length > 0) {

        const note =
            document.createElement("p");

        note.textContent =
            "Note: "
            + task.notes.join(", ");

        card.appendChild(note);

    }


    const actions =
        document.createElement("div");

    actions.classList.add(
        "card-actions"
    );


    if (task.status !== "todo") {

        const leftButton =
            document.createElement("button");

        leftButton.type = "button";

        leftButton.textContent =
            "← Previous";

        leftButton.dataset.action =
            "left";

        actions.appendChild(
            leftButton
        );

    }


    if (task.status !== "done") {

        const rightButton =
            document.createElement("button");

        rightButton.type = "button";

        rightButton.textContent =
            "Next →";

        rightButton.dataset.action =
            "right";

        actions.appendChild(
            rightButton
        );

    }


    card.appendChild(actions);

    return card;

}


function calculateSummary() {

    let completed = 0;
    let budget = 0;

    let todo = 0;
    let progress = 0;
    let done = 0;


    for (const task of tasks) {

        budget += task.cost;


        if (task.status === "todo") {

            todo++;

        } else if (
            task.status === "progress"
        ) {

            progress++;

        } else if (
            task.status === "done"
        ) {

            done++;
            completed++;

        }

    }


    const percentage =
        Math.round(
            completed
            / tasks.length
            * 100
        );


    completedCount.textContent =
        completed
        + " / "
        + tasks.length;


    totalBudget.textContent =
        budget
        + " ₸";


    progressBar.value =
        percentage;


    progressText.textContent =
        percentage
        + "% complete";


    todoCount.textContent =
        todo;

    progressCount.textContent =
        progress;

    doneCount.textContent =
        done;

}


function getVisibleTasks() {

    const selectedTag =
        tagFilter.value;


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const visibleTasks = [];


    for (const task of tasks) {

        const matchesTag =
            selectedTag === "all"
            ||
            task.tag === selectedTag;


        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(searchText);


        if (
            matchesTag
            &&
            matchesSearch
        ) {

            visibleTasks.push(task);

        }

    }


    if (sortSelect.value === "high") {

        visibleTasks.sort(
            function (a, b) {

                return (
                    b.priority
                    - a.priority
                );

            }
        );

    } else if (
        sortSelect.value === "low"
    ) {

        visibleTasks.sort(
            function (a, b) {

                return (
                    a.priority
                    - b.priority
                );

            }
        );

    }


    return visibleTasks;

}


function render() {

    todoColumn.textContent = "";
    progressColumn.textContent = "";
    doneColumn.textContent = "";

    emptyMessage.textContent = "";


    const visibleTasks =
        getVisibleTasks();


    for (const task of visibleTasks) {

        const card =
            createTaskCard(task);


        if (task.status === "todo") {

            todoColumn.appendChild(card);

        } else if (
            task.status === "progress"
        ) {

            progressColumn.appendChild(
                card
            );

        } else if (
            task.status === "done"
        ) {

            doneColumn.appendChild(card);

        }

    }


    if (visibleTasks.length === 0) {

        emptyMessage.textContent =
            "No travel tasks found.";

    }


    calculateSummary();

}


function countInProgress() {

    let count = 0;


    for (const task of tasks) {

        if (
            task.status === "progress"
        ) {

            count++;

        }

    }


    return count;

}


function canEnterProgress() {

    return (
        countInProgress()
        < MAX_IN_PROGRESS
    );

}


function moveRight(task) {

    if (task.status === "todo") {

        if (!canEnterProgress()) {

            messageElement.textContent =
                "Cannot move this task. "
                + "In Progress already has "
                + MAX_IN_PROGRESS
                + " tasks.";

            return;

        }


        task.status =
            "progress";

    } else if (
        task.status === "progress"
    ) {

        task.status =
            "done";

    }


    messageElement.textContent = "";

    render();

}


function moveLeft(task) {

    if (task.status === "done") {

        if (!canEnterProgress()) {

            messageElement.textContent =
                "Cannot move this task back. "
                + "In Progress already has "
                + MAX_IN_PROGRESS
                + " tasks.";

            return;

        }


        task.status =
            "progress";

    } else if (
        task.status === "progress"
    ) {

        task.status =
            "todo";

    }


    messageElement.textContent = "";

    render();

}


function findTaskById(id) {

    for (const task of tasks) {

        if (task.id === id) {

            return task;

        }

    }


    return null;

}


board.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {
            return;
        }


        const card =
            button.closest(
                ".task-card"
            );


        if (!card) {
            return;
        }


        const taskId =
            Number(
                card.dataset.id
            );


        const selectedTask =
            findTaskById(taskId);


        if (!selectedTask) {
            return;
        }


        if (
            button.dataset.action
            === "right"
        ) {

            moveRight(
                selectedTask
            );

        } else if (
            button.dataset.action
            === "left"
        ) {

            moveLeft(
                selectedTask
            );

        }

    }
);


searchInput.addEventListener(
    "input",
    render
);


tagFilter.addEventListener(
    "change",
    render
);


sortSelect.addEventListener(
    "change",
    render
);


render();