let notesData = [];

fetch('premedical-notes.json')
  .then(res => res.json())
  .then(data => {
    notesData = data;
    renderNotes(data);
    updateSubjectOptions();
    updateChapterOptions();
  });

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
        <div class="card mb-4">
          <div class="card-body">
            <h5>${note.title}</h5>
            <p><strong>Class:</strong> ${note.class}</p>
            <p><strong>Subject:</strong> ${note.subject}</p>
            <p><strong>Chapter:</strong> ${note.chapter}</p>
            <a href="${note.link}" target="_blank" class="btn btn-primary">View Notes</a>
          </div>
        </div>
      </div>
    `;
  });
}

// 🔁 Update Subjects based on selected Class
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

  updateChapterOptions(); // Refresh chapters also
}

// 🔁 Update Chapters based on selected Class + Subject
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

// 🔁 Filtering Notes on Change
['classFilter', 'subjectFilter', 'chapterFilter'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    updateSubjectOptions(); // on any change, update subjects
    updateChapterOptions(); // on any change, update chapters

    const selectedClass = document.getElementById('classFilter').value;
    const selectedSubject = document.getElementById('subjectFilter').value;
    const selectedChapter = document.getElementById('chapterFilter').value;

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
