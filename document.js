document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('meta-edit-modal');
  const closeModalButton = document.getElementById('meta-edit-modal-close');
  const cancelButton = document.getElementById('meta-edit-cancel');
  const form = document.getElementById('meta-edit-form');
  const addEncaminhamentoButton = document.getElementById('add-encaminhamento');
  const encaminhamentosTable = document.getElementById('encaminhamentos-table').querySelector('tbody');

  let encaminhamentos = [];

  function openModal(meta) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Populate form fields with meta data
    document.getElementById('meta-iniciativa').value = meta.iniciativa || '';
    document.getElementById('meta-resultado').value = meta.resultado || '';
    document.getElementById('meta-description').value = meta.description || '';
    document.getElementById('meta-responsible').value = meta.responsible || '';
    document.getElementById('meta-status').value = meta.status || 'satisfatorio';
    document.getElementById('meta-alcance').value = meta.alcance || 0;
    document.getElementById('meta-parecer').value = meta.parecer || '';
    encaminhamentos = meta.encaminhamentos || [];
    renderEncaminhamentos();
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    form.reset();
    encaminhamentos = [];
    renderEncaminhamentos();
  }

  function renderEncaminhamentos() {
    encaminhamentosTable.innerHTML = '';
    encaminhamentos.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="text" value="${item.description}" class="form-input encaminhamento-description"></td>
        <td><input type="text" value="${item.prazo}" class="form-input encaminhamento-prazo"></td>
        <td><input type="text" value="${item.responsavel}" class="form-input encaminhamento-responsavel"></td>
        <td><button type="button" class="meta-edit-btn" data-index="${index}">Remover</button></td>
      `;
      encaminhamentosTable.appendChild(row);
    });
  }

  function addEncaminhamento() {
    encaminhamentos.push({ description: '', prazo: '', responsavel: '' });
    renderEncaminhamentos();
  }

  function removeEncaminhamento(index) {
    encaminhamentos.splice(index, 1);
    renderEncaminhamentos();
  }

  closeModalButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);

  addEncaminhamentoButton.addEventListener('click', addEncaminhamento);

  encaminhamentosTable.addEventListener('click', function (e) {
    if (e.target.classList.contains('meta-edit-btn')) {
      const index = e.target.dataset.index;
      removeEncaminhamento(index);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const meta = {
      iniciativa: document.getElementById('meta-iniciativa').value,
      resultado: document.getElementById('meta-resultado').value,
      description: document.getElementById('meta-description').value,
      responsible: document.getElementById('meta-responsible').value,
      status: document.getElementById('meta-status').value,
      alcance: parseInt(document.getElementById('meta-alcance').value, 10),
      parecer: document.getElementById('meta-parecer').value,
      encaminhamentos: encaminhamentos.map((row, index) => ({
        description: document.querySelectorAll('.encaminhamento-description')[index].value,
        prazo: document.querySelectorAll('.encaminhamento-prazo')[index].value,
        responsavel: document.querySelectorAll('.encaminhamento-responsavel')[index].value,
      })),
    };

    console.log('Meta saved:', meta);
    closeModal();
  });
});
