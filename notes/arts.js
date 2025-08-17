let notesData = [];

fetch('arts.json')
  .then(res => res.json())
  .then(data => {
    notesData = data;
    updateSubjectOptions();
    updateChapterOptions();
        renderNotes([]); // 👈 Add this line

  });

// Render cards
function renderNotes(data) {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML =  `
     <div class="typewriter-container">
    🔍 Please select Class, Subject, or Chapter to view notes.
  </div>
    `;
    return;
  }

  data.forEach(note => {
    container.innerHTML += `
    <div class="col-md-4 mb-5">
  <div class="custom-card position-relative h-100">
    
    <!-- Top Chapter Bar -->
    <div class="card-header-strip text-white text-center">
      ${note.chapter}
    </div>
    
    <!-- Icon -->
    <div class="card-icon text-center">
      <i class="fas fa-book-open"></i>
    </div>

    <!-- Body -->
    <div class="card-body text-white text-center">
      <h5 class="card-title pb-2">${note.title}</h5>
      <p class="card-text">📘 <strong>Class:</strong> ${note.class}</p>
      <p class="card-text">🧪 <strong>Subject:</strong> ${note.subject}</p>
    </div>

    <!-- Footer -->
    <div class="card-footer text-center">
      <a href="${note.link}" target="_blank" class="btn view-btn mt-2" download>📄 View PDF</a>
    </div>
  </div>
</div>


    `;
  });
}

// Update subject dropdown based on selected class
function updateSubjectOptions() {
  const selectedClass = document.getElementById('classFilter').value;
  const subjectFilter = document.getElementById('subjectFilter');
  subjectFilter.innerHTML = '<option value="">Select Subject</option>';

  const filteredSubjects = [...new Set(notesData
    .filter(item => selectedClass === '' || item.class === selectedClass)
    .map(item => item.subject))];

  filteredSubjects.forEach(subject => {
    subjectFilter.innerHTML += `<option value="${subject}">${subject}</option>`;
  });

  updateChapterOptions(); // Update chapters accordingly
}

// Update chapter dropdown based on selected class and subject
function updateChapterOptions() {
  const selectedClass = document.getElementById('classFilter').value;
  const selectedSubject = document.getElementById('subjectFilter').value;
  const chapterFilter = document.getElementById('chapterFilter');
  chapterFilter.innerHTML = '<option value="">Select Chapter</option>';

  const filteredChapters = [...new Set(notesData
    .filter(item =>
      (selectedClass === '' || item.class === selectedClass) &&
      (selectedSubject === '' || item.subject === selectedSubject)
    )
    .map(item => item.chapter)
  )];

  filteredChapters.forEach(chapter => {
    chapterFilter.innerHTML += `<option value="${chapter}">${chapter}</option>`;
  });
}


// Attach filter logic
['classFilter', 'subjectFilter', 'chapterFilter'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    const selectedClass = document.getElementById('classFilter').value;
    const selectedSubject = document.getElementById('subjectFilter').value;
    const selectedChapter = document.getElementById('chapterFilter').value;

    // Update dropdowns only if class or subject changed
    if (id === 'classFilter') {
      updateSubjectOptions(selectedClass);
    }
    if (id === 'classFilter' || id === 'subjectFilter') {
      updateChapterOptions(selectedClass, selectedSubject);
    }

    const filtered = notesData.filter(item => {
      return (
        (selectedClass === '' || item.class === selectedClass) &&
        (selectedSubject === '' || item.subject === selectedSubject) &&
        (selectedChapter === '' || item.chapter === selectedChapter)
      );
    });

    renderNotes(filtered);
  });
});

