let notesData = [];

fetch('premedical-notes.json')
  .then(res => res.json())
  .then(data => {
    notesData = data;
    renderNotes(data);
    updateSubjectOptions();
    updateChapterOptions();
  });

// Render cards
function renderNotes(data) {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="text-center text-danger">No notes found.</p>';
    return;
  }

  data.forEach(note => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${note.title}</h5>
            <p class="card-text"><strong>Class:</strong> ${note.class}</p>
            <p class="card-text"><strong>Subject:</strong> ${note.subject}</p>
            <p class="card-text"><strong>Chapter:</strong> ${note.chapter}</p>
            <a href="${note.link}" target="_blank" class="btn btn-primary">View Notes</a>
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
    .map(item => item.chapter))];

  filteredChapters.forEach(chapter => {
    chapterFilter.innerHTML += `<option value="${chapter}">${chapter}</option>`;
  });
}

// Filter logic on dropdown change
['classFilter', 'subjectFilter', 'chapterFilter'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    const selectedClass = document.getElementById('classFilter').value;
    const selectedSubject = document.getElementById('subjectFilter').value;
    const selectedChapter = document.getElementById('chapterFilter').value;

    // Only update dropdowns if not selecting a chapter
    if (id !== 'chapterFilter') {
      updateSubjectOptions();
      updateChapterOptions();
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
