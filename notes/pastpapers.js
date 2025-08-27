let data = {};
const classSelect = document.getElementById("classSelect");
const groupSelect = document.getElementById("groupSelect");
const subjectSelect = document.getElementById("subjectSelect");
const cardsContainer = document.getElementById("cardsContainer");
const instructionLine = document.getElementById("instructionLine");

fetch("pastpapers.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    populateClassOptions();
  });


function populateClassOptions() {
  for (const className in data) {
    const option = document.createElement("option");
    option.value = className;
    option.textContent = className;
    classSelect.appendChild(option);
  }
}

function updateInstructionVisibility() {
  if (
    classSelect.value !== "" ||
    groupSelect.value !== "" ||
    subjectSelect.value !== ""
  ) {
    instructionLine.style.display = "none";
  } else {
    instructionLine.style.display = "block";
  }
}

classSelect.addEventListener("change", () => {
  resetSelect(groupSelect, "Select Group");
  resetSelect(subjectSelect, "Select Subject");
  cardsContainer.innerHTML = "";
  updateInstructionVisibility();

  const selectedClass = classSelect.value;
  if (selectedClass && data[selectedClass]) {
    groupSelect.disabled = false;
    Object.keys(data[selectedClass]).forEach(group => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      groupSelect.appendChild(option);
    });
  } else {
    groupSelect.disabled = true;
    subjectSelect.disabled = true;
  }
});

groupSelect.addEventListener("change", () => {
  resetSelect(subjectSelect, "Select Subject");
  cardsContainer.innerHTML = "";
  updateInstructionVisibility();

  const selectedClass = classSelect.value;
  const selectedGroup = groupSelect.value;

  if (selectedGroup && data[selectedClass][selectedGroup]) {
    subjectSelect.disabled = false;
    data[selectedClass][selectedGroup].forEach(subject => {
      const option = document.createElement("option");
      option.value = subject.name;
      option.textContent = subject.name;
      subjectSelect.appendChild(option);
    });
    showCards(data[selectedClass][selectedGroup], selectedGroup, selectedClass);
  } else {
    subjectSelect.disabled = true;
  }
});

subjectSelect.addEventListener("change", () => {
  const selectedClass = classSelect.value;
  const selectedGroup = groupSelect.value;
  const selectedSubject = subjectSelect.value;
  const subjectList = data[selectedClass][selectedGroup];

  const filtered = selectedSubject
    ? subjectList.filter(sub => sub.name === selectedSubject)
    : subjectList;

  showCards(filtered, selectedGroup, selectedClass);
  updateInstructionVisibility();
});

function resetSelect(selectElement, defaultText) {
  selectElement.innerHTML = `<option value="">${defaultText}</option>`;
  selectElement.disabled = true;
}

function getSubjectIcon(subject) {
  const icons = {
    "Physics": "fa-solid fa-atom",
    "Chemistry": "fa-solid fa-flask",
    "Biology": "fa-solid fa-dna",
    "Mathematics": "fa-solid fa-calculator",
    "Math": "fa-solid fa-calculator",
    "Computer": "fa-solid fa-computer",
    "Programming": "fa-solid fa-code",
    "Urdu": "fa-solid fa-book-open",
    "English": "fa-solid fa-book-open",
    "Islamiat": "fa-solid fa-mosque",
    "Islamic Studies (Elective)": "fa-solid fa-mosque",
    "Pakistan Studies": "fa-solid fa-flag",
    "Pst": "fa-solid fa-flag",
    "Accounting": "fa-solid fa-file-invoice-dollar",
    "Economics": "fa-solid fa-chart-line",
    "History": "fa-solid fa-landmark",
    "Education": "fa-solid fa-chalkboard-teacher",
    "Sociology": "fa-solid fa-users",
    "Civics": "fa-solid fa-scale-balanced",
    "Business Mathematics": "fa-solid fa-square-root-variable",
    "Principles of Commerce": "fa-solid fa-building-columns"
  };
  return icons[subject] || "fa-solid fa-book";
}

function showCards(subjects, group, className) {
  cardsContainer.innerHTML = "";
  subjects.forEach(subject => {
    const iconClass = getSubjectIcon(subject.name);
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
          <div class="card h-100 p-4">
            <div class="card-body d-flex flex-column">
              <div class="mb-3 text-center">
                <i class="${iconClass}" style="font-size: 2.5rem; color: #00ffff;"></i>
              </div>
              <h5 class="card-title text-center">${subject.name}</h5>
              <p class="card-text text-center">
                Class: <strong>${className}</strong><br/>
                Group: <strong>${group}</strong>
              </p>
              <a href="${subject.url}" class="btn btn-primary mt-auto w-100" download onclick="alert('your file is downloading...')">
                <i class="fa-solid fa-download"></i> Download
              </a>
            </div>
          </div>`;
    cardsContainer.appendChild(col);
  });
}