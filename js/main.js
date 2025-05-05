// GradeTracker - Modern School Grades Management App

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize charts
  initializeCharts();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load initial data
  loadSampleData();
  
  // Animate stats cards
  animateStatsCards();
});

// Sample data for demonstration
const sampleSubjects = [
  { id: 1, name: 'Matemática', color: '#00B0FF' },
  { id: 2, name: 'Português', color: '#FF6B35' },
  { id: 3, name: 'Ciências', color: '#39FF14' },
  { id: 4, name: 'História', color: '#764AF1' },
  { id: 5, name: 'Geografia', color: '#FFC107' }
];

const sampleGrades = [
  { id: 1, subjectId: 1, grade: 8.5, date: '2023-09-10', period: '1AV', notes: 'Prova: Álgebra' },
  { id: 2, subjectId: 1, grade: 9.0, date: '2023-10-15', period: '2AV', notes: 'Trabalho: Geometria' },
  { id: 3, subjectId: 2, grade: 7.5, date: '2023-09-12', period: '1AV', notes: 'Redação' },
  { id: 4, subjectId: 3, grade: 8.0, date: '2023-10-05', period: '1AV', notes: 'Experimento' },
  { id: 5, subjectId: 4, grade: 9.5, date: '2023-10-20', period: '2AV', notes: 'Apresentação' },
  { id: 6, subjectId: 5, grade: 7.0, date: '2023-09-25', period: '1AV', notes: 'Mapa conceitual' }
];

// Chart initialization
function initializeCharts() {
  // Overall performance chart (doughnut)
  const ctxOverall = document.getElementById('overallChart').getContext('2d');
  const overallChart = new Chart(ctxOverall, {
    type: 'doughnut',
    data: {
      labels: sampleSubjects.map(subject => subject.name),
      datasets: [{
        data: calculateAverageGradesBySubject(),
        backgroundColor: sampleSubjects.map(subject => subject.color),
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });

  // Progress chart (line)
  const ctxProgress = document.getElementById('progressChart').getContext('2d');
  const progressChart = new Chart(ctxProgress, {
    type: 'line',
    data: {
      labels: ['1ª AV', '2ª AV', '3ª AV', '4ª AV'],
      datasets: sampleSubjects.map(subject => {
        return {
          label: subject.name,
          data: generateRandomProgression(),
          borderColor: subject.color,
          backgroundColor: `${subject.color}20`,
          tension: 0.3,
          fill: false
        };
      })
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Comparison chart (bar)
  const ctxComparison = document.getElementById('comparisonChart').getContext('2d');
  const comparisonChart = new Chart(ctxComparison, {
    type: 'bar',
    data: {
      labels: ['1ª AV', '2ª AV', '3ª AV', '4ª AV'],
      datasets: sampleSubjects.map(subject => {
        return {
          label: subject.name,
          data: generateRandomProgression(),
          backgroundColor: subject.color,
          borderColor: `${subject.color}80`,
          borderWidth: 1,
          borderRadius: 4
        };
      })
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Nota média'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Período'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Inter',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Event listeners setup
function setupEventListeners() {
  // Form submission
  const gradeForm = document.getElementById('gradeForm');
  if (gradeForm) {
    gradeForm.addEventListener('submit', handleFormSubmit);
  }

  // Modal events
  const addGradeBtn = document.getElementById('addGradeBtn');
  const modalClose = document.querySelector('.modal-close');
  const modal = document.getElementById('gradeModal');

  if (addGradeBtn) {
    addGradeBtn.addEventListener('click', () => {
      // Reset form when adding a new grade
      document.getElementById('gradeForm').reset();
      // Clear edit ID if it exists
      delete document.getElementById('gradeForm').dataset.editId;
      // Reset modal title
      document.querySelector('.modal-title').textContent = 'Adicionar Nova Nota';
      // Show modal
      modal.classList.add('show');
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // Analysis tabs
  const tabs = document.querySelectorAll('.analysis-tab');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Update tab styling
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding content
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Map the tab index to the corresponding content
      const tabContentIds = ['comparison-tab', 'trends-tab', 'forecast-tab', 'recommendations-tab'];
      const contentToShow = document.getElementById(tabContentIds[index]);
      if (contentToShow) {
        contentToShow.classList.add('active');
      }
      
      // Initialize charts for the newly shown tab
      if (index === 0) {
        // Comparison chart is already initialized in initializeCharts()
      } else if (index === 1) {
        initializeTrendsChart();
      } else if (index === 2) {
        initializeForecastChart();
      }
    });
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const subject = document.getElementById('subject').value;
  const grade = parseFloat(document.getElementById('grade').value);
  const date = document.getElementById('date').value;
  const period = document.getElementById('period').value;
  const notes = document.getElementById('notes').value;
  
  // Validation
  if (!subject || isNaN(grade) || !date || !period) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  // Check if we're editing an existing grade or adding a new one
  const editId = e.target.dataset.editId;
  
  if (editId) {
    // Find the grade to edit
    const index = sampleGrades.findIndex(g => g.id === parseInt(editId));
    
    if (index !== -1) {
      // Update the existing grade
      sampleGrades[index] = {
        ...sampleGrades[index],
        subjectId: parseInt(subject),
        grade: grade,
        date: date,
        period: period,
        notes: notes
      };
      
      // Show success notification
      showNotification('Nota atualizada com sucesso!', 'success');
    }
    
    // Clear the edit ID
    delete e.target.dataset.editId;
    document.querySelector('.modal-title').textContent = 'Adicionar Nova Nota';
  } else {
    // Add new grade
    const newGrade = {
      id: sampleGrades.length + 1,
      subjectId: parseInt(subject),
      grade: grade,
      date: date,
      period: period,
      notes: notes
    };
    
    sampleGrades.push(newGrade);
    
    // Show success notification
    showNotification('Nota adicionada com sucesso!', 'success');
  }
  
  // Update UI
  updateGradesTable();
  updateCharts();
  updateStatsCards();
  
  // Reset form and close modal
  e.target.reset();
  document.getElementById('gradeModal').classList.remove('show');
}

// Update the grades table
function updateGradesTable() {
  const tbody = document.querySelector('.grades-table:not(:has(#subject-averages-tbody)) tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sampleGrades.forEach(grade => {
    const subject = sampleSubjects.find(s => s.id === grade.subjectId);
    if (!subject) return; // Skip if subject not found
    
    // Calculate the subject average
    const average = calculateAverageForSubject(subject.id);
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${subject.name}</td>
      <td>${grade.grade.toFixed(1)}</td>
      <td>${formatDate(grade.date)}</td>
      <td>${grade.period}</td>
      <td>${getGradeBadge(grade.grade)}</td>
      <td>
        <button class="btn-edit" data-id="${grade.id}">Editar</button>
        <button class="btn-delete" data-id="${grade.id}">Excluir</button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
  
  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const gradeToEdit = sampleGrades.find(grade => grade.id === id);
      
      if (gradeToEdit) {
        // Populate the form with the grade data
        document.getElementById('subject').value = gradeToEdit.subjectId;
        document.getElementById('grade').value = gradeToEdit.grade;
        document.getElementById('date').value = gradeToEdit.date;
        document.getElementById('period').value = gradeToEdit.period;
        document.getElementById('notes').value = gradeToEdit.notes || '';
        
        // Add a data attribute to the form to indicate we're editing
        const form = document.getElementById('gradeForm');
        form.dataset.editId = id;
        
        // Change the modal title
        document.querySelector('.modal-title').textContent = 'Editar Nota';
        
        // Show the modal
        document.getElementById('gradeModal').classList.add('show');
      }
    });
  });
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      
      // Show confirmation dialog
      if (confirm('Tem certeza que deseja excluir esta nota?')) {
        // Find the index of the grade to delete
        const index = sampleGrades.findIndex(grade => grade.id === id);
        
        if (index !== -1) {
          // Remove the grade from the array
          sampleGrades.splice(index, 1);
          
          // Update the UI
          updateGradesTable();
          updateCharts();
          updateStatsCards();
          
          // Show success notification
          showNotification('Nota excluída com sucesso!', 'success');
        }
      }
    });
  });
}

// Load sample data into the UI
function loadSampleData() {
  // Populate subject dropdown
  const subjectSelect = document.getElementById('subject');
  if (subjectSelect) {
    sampleSubjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject.id;
      option.textContent = subject.name;
      subjectSelect.appendChild(option);
    });
  }
  
  // Update grades table
  updateGradesTable();
  
  // Update stats cards
  updateStatsCards();
}

// Update stats cards with calculated data
function updateStatsCards() {
  const overallAvg = document.getElementById('overallAverage');
  const bestSubject = document.getElementById('bestSubject');
  const improvementNeeded = document.getElementById('improvementNeeded');
  
  if (overallAvg) {
    const avg = calculateOverallAverage();
    overallAvg.textContent = avg.toFixed(1);
  }
  
  if (bestSubject) {
    const best = findBestSubject();
    bestSubject.textContent = best.name;
  }
  
  if (improvementNeeded) {
    const worst = findWorstSubject();
    improvementNeeded.textContent = worst.name;
  }

  // Update subject averages table
  updateSubjectAveragesTable();
}

// Update subject averages table
function updateSubjectAveragesTable() {
  const tbody = document.getElementById('subject-averages-tbody');
  if (!tbody) {
    console.error("Element with ID 'subject-averages-tbody' not found");
    return;
  }
  
  tbody.innerHTML = '';
  
  // Calculate overall class average across all subjects
  const overallAvg = calculateOverallAverage();
  
  sampleSubjects.forEach(subject => {
    const tr = document.createElement('tr');
    
    // Calculate the average for this subject
    const average = calculateAverageForSubject(subject.id);
    
    // Get grades for this subject by period
    const gradesByPeriod = {
      '1AV': getGradeForSubjectAndPeriod(subject.id, '1AV'),
      '2AV': getGradeForSubjectAndPeriod(subject.id, '2AV'),
      '3AV': getGradeForSubjectAndPeriod(subject.id, '3AV'),
      '4AV': getGradeForSubjectAndPeriod(subject.id, '4AV')
    };
    
    // Style based on performance compared to overall average
    let rowClass = '';
    if (average > overallAvg) {
      rowClass = 'above-average';
    } else if (average < overallAvg) {
      rowClass = 'below-average';
    }
    
    tr.className = rowClass;
    tr.innerHTML = `
      <td>${subject.name}</td>
      <td><strong>${average.toFixed(1)}</strong></td>
      <td>${gradesByPeriod['1AV'] !== null ? gradesByPeriod['1AV'].toFixed(1) : '-'}</td>
      <td>${gradesByPeriod['2AV'] !== null ? gradesByPeriod['2AV'].toFixed(1) : '-'}</td>
      <td>${gradesByPeriod['3AV'] !== null ? gradesByPeriod['3AV'].toFixed(1) : '-'}</td>
      <td>${gradesByPeriod['4AV'] !== null ? gradesByPeriod['4AV'].toFixed(1) : '-'}</td>
    `;
    
    tbody.appendChild(tr);
  });
  
  // Overall average is already displayed in the stats card
}

// Get grade for a specific subject and period
function getGradeForSubjectAndPeriod(subjectId, period) {
  const grade = sampleGrades.find(g => g.subjectId === subjectId && g.period === period);
  return grade ? grade.grade : null;
}

// Helper functions
function calculateAverageGradesBySubject() {
  return sampleSubjects.map(subject => {
    const subjectGrades = sampleGrades.filter(grade => grade.subjectId === subject.id);
    if (subjectGrades.length === 0) return 0;
    
    const sum = subjectGrades.reduce((acc, grade) => acc + grade.grade, 0);
    return sum / subjectGrades.length;
  });
}

function calculateOverallAverage() {
  if (sampleGrades.length === 0) return 0;
  
  const sum = sampleGrades.reduce((acc, grade) => acc + grade.grade, 0);
  return sum / sampleGrades.length;
}

function findBestSubject() {
  const averages = calculateAverageGradesBySubject();
  const maxIndex = averages.indexOf(Math.max(...averages));
  return sampleSubjects[maxIndex];
}

function findWorstSubject() {
  const averages = calculateAverageGradesBySubject();
  const minIndex = averages.indexOf(Math.min(...averages));
  return sampleSubjects[minIndex];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function getGradeBadge(grade) {
  if (grade >= 9) {
    return '<span class="badge badge-success">Excelente</span>';
  } else if (grade >= 7) {
    return '<span class="badge badge-success">Bom</span>';
  } else if (grade >= 5) {
    return '<span class="badge badge-warning">Regular</span>';
  } else {
    return '<span class="badge badge-danger">Precisa Melhorar</span>';
  }
}

function generateRandomProgression() {
  // Generate random progression data for the line chart
  return [
    Math.random() * 3 + 5, // P1: between 5-8
    Math.random() * 3 + 6, // P2: between 6-9
    Math.random() * 2 + 7, // P3: between 7-9
    Math.random() * 2 + 7  // P4: between 7-9
  ];
}

// Animation functions
function animateStatsCards() {
  const cards = document.querySelectorAll('.stats-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, index * 200);
  });
}

// Notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type} fade-in`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('fade-in');
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Initialize trends chart
function initializeTrendsChart() {
  const ctx = document.getElementById('trendsChart');
  if (!ctx) return;
  
  if (ctx.chart) {
    ctx.chart.destroy();
  }
  
  const trendsData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: sampleSubjects.map(subject => {
      return {
        label: subject.name,
        data: Array.from({length: 6}, () => Math.random() * 4 + 5), // Random values between 5-9
        borderColor: subject.color,
        backgroundColor: `${subject.color}20`,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      };
    })
  };
  
  ctx.chart = new Chart(ctx, {
    type: 'line',
    data: trendsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Notas'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Mês'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      },
      animation: {
        duration: 1000
      }
    }
  });
}

// Initialize forecast chart
function initializeForecastChart() {
  const ctx = document.getElementById('forecastChart');
  if (!ctx) return;
  
  if (ctx.chart) {
    ctx.chart.destroy();
  }
  
  const forecastData = {
    labels: ['Atual', 'Projeção'],
    datasets: sampleSubjects.map(subject => {
      const current = calculateAverageForSubject(subject.id);
      const projection = Math.min(10, current * (1 + (Math.random() * 0.2)));
      
      return {
        label: subject.name,
        data: [current, projection],
        backgroundColor: subject.color,
        borderColor: `${subject.color}80`,
        borderWidth: 1,
        barPercentage: 0.7
      };
    })
  };
  
  ctx.chart = new Chart(ctx, {
    type: 'bar',
    data: forecastData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      },
      animation: {
        duration: 1000
      }
    }
  });
}

// Helper to calculate average for a specific subject
function calculateAverageForSubject(subjectId) {
  const subjectGrades = sampleGrades.filter(grade => grade.subjectId === subjectId);
  if (subjectGrades.length === 0) return 0;
  
  const sum = subjectGrades.reduce((acc, grade) => acc + grade.grade, 0);
  return sum / subjectGrades.length;
}

// Update charts with new data
function updateCharts() {
  // In a real implementation, this would update the charts with new data
  // For this demo, we'll just re-initialize the charts
  initializeCharts();
  
  // Update other charts if they're visible
  const trendsTab = document.getElementById('trends-tab');
  const forecastTab = document.getElementById('forecast-tab');
  
  if (trendsTab && trendsTab.classList.contains('active')) {
    initializeTrendsChart();
  }
  
  if (forecastTab && forecastTab.classList.contains('active')) {
    initializeForecastChart();
  }
}

// PWA-specific functions
// LocalStorage management for offline functionality
function saveDataToLocalStorage() {
  localStorage.setItem('gradetracker_subjects', JSON.stringify(sampleSubjects));
  localStorage.setItem('gradetracker_grades', JSON.stringify(sampleGrades));
  localStorage.setItem('gradetracker_lastSync', new Date().toISOString());
}

function loadDataFromLocalStorage() {
  const storedSubjects = localStorage.getItem('gradetracker_subjects');
  const storedGrades = localStorage.getItem('gradetracker_grades');
  
  if (storedSubjects && storedGrades) {
    try {
      const subjects = JSON.parse(storedSubjects);
      const grades = JSON.parse(storedGrades);
      
      // Atualizar as variáveis globais apenas se os dados forem válidos
      if (Array.isArray(subjects) && Array.isArray(grades)) {
        // Mesclar os dados do armazenamento local com os dados existentes
        sampleSubjects.length = 0;
        sampleGrades.length = 0;
        
        subjects.forEach(subject => sampleSubjects.push(subject));
        grades.forEach(grade => sampleGrades.push(grade));
        
        // Atualizar a interface
        updateGradesTable();
        updateStatsCards();
        updateCharts();
        
        return true;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do armazenamento local:', error);
    }
  }
  
  return false;
}

// Detectar quando o app estiver online/offline
window.addEventListener('online', () => {
  showNotification('Você está online agora. Dados serão sincronizados.', 'success');
  // Aqui você poderia implementar uma sincronização com um backend
});

window.addEventListener('offline', () => {
  showNotification('Você está offline. Os dados serão salvos localmente.', 'warning');
});

// Salvar dados quando o aplicativo for fechado ou minimizado
window.addEventListener('beforeunload', () => {
  saveDataToLocalStorage();
});

// Verificar dados locais ao carregar
document.addEventListener('DOMContentLoaded', () => {
  // Tentar carregar dados do localStorage primeiro
  const hasLocalData = loadDataFromLocalStorage();
  
  if (!hasLocalData) {
    // Se não houver dados locais, carregar dados de exemplo
    loadSampleData();
  }
  
  // Otimização para iOS
  if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
    // Evitar delay de 300ms para eventos de toque
    document.documentElement.style.touchAction = 'manipulation';
    
    // Ajustar tamanho dos elementos para dedos (mínimo 44x44 pixels)
    const touchElements = document.querySelectorAll('button, .btn, a.nav-link, input[type="submit"]');
    touchElements.forEach(el => {
      el.style.minHeight = '44px';
      el.style.minWidth = '44px';
    });
  }
  
  // Verificar status de conexão
  if (!navigator.onLine) {
    showNotification('Você está offline. Os dados serão salvos localmente.', 'warning');
  }
});