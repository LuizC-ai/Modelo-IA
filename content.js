document.addEventListener('DOMContentLoaded', function() {
  // Debounce function to limit the frequency of function execution
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const processarTexto = async (texto) => {
    // Validation for protocol number input
    if (texto.startsWith("Favor cancelar o protocolo")) {
      const protocolo = texto.split(" ")[3];
      if (!protocolo.match(/^\d+$/)) { // Check if it's a number
        alert("Número do protocolo inválido.");
        return;
      }
      cancelarProtocolo(protocolo);
    } else {
      const sugestoes = await buscarSugestoesComIA(texto);
      exibirSugestoes(sugestoes);
    }
  };

  const inputHandler = debounce(async (e) => {
    const texto = e.target.value;
    await processarTexto(texto);
  }, 500); // AJustar debounce se caso necessario.

  document.getElementById('resumo').addEventListener('input', inputHandler);
    
  async function buscarSugestoesComIA(texto) {
    // Implementar o Copiloto API aqui
    // Retorne a sugestão recebida da IA
    return ["Sugestão 1", "Sugestão 2"]; // Example return
  }

  function exibirSugestoes(sugestoes) {
    const container = document.getElementById('sugestoes');
    container.innerHTML = '';
    sugestoes.forEach(sugestao => {
      const div = document.createElement('div');
      const botao = document.createElement('button');
      botao.textContent = "Selecionar";
      botao.onclick = function() { alert(`Sugestão '${sugestao}' selecionada`); };
      div.textContent = sugestao + " ";
      div.appendChild(botao);
      container.appendChild(div);
    });
    container.style.display = 'block';
  }

  async function cancelarProtocolo(protocolo) {
    // Implemente a lógica de autenticação aqui
    console.log(`Cancelando protocolo ${protocolo}`);
    // Simular chamada de API para cancelar o protocolo
    setTimeout(() => {
      alert(`Protocolo ${protocolo} cancelado com sucesso.`);
    }, 1000);
  }
})


// Modificando a função de resolução para adicionar o ouvinte de evento 'input'
function resolve() {
  const fieldsToMonitor = ['#description', '#summary', '#P_DURACAO'];
  const observer = new MutationObserver(() => {
    fieldsToMonitor.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.getAttribute('data-listener-added')) {
        field.setAttribute('data-listener-added', 'true');
        // Adicione o ouvinte de evento 'input' usando debounce
        field.addEventListener('input', debounce(() => {
          provideSuggestions(field);
        }, 500)); // 500ms delay
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

resolve();

// async function provideSuggestions(field) {
//   let suggestionsContainer = document.getElementById('suggestions');
//   if (!suggestionsContainer) {
//     suggestionsContainer = document.createElement('div');
//     suggestionsContainer.id = 'suggestions';
//     suggestionsContainer.className = 'suggestions-container';
//     document.body.appendChild(suggestionsContainer);
//   }

//   const text = field.value;
//   if (text) {
//     await generateSuggestions(text, displaySuggestions, field);
//   } else {
//     console.log('Field value is empty, skipping suggestions.');
//   }
// }

function identifyIntent(text) {
  // Check if the text contains "cancelar o protocolo"
  if (text.includes("cancelar o protocolo")) {
    return 'finalizeRequest';
  }
  // Check if the text contains indicative words of a question
  else if (text.includes("como") || text.includes("o que é") || text.includes("por que")) {
    return 'question';
  }
  // Returnar 'desconhecida' se nenhuma intenção for identificada
  else {
    return 'desconhecida';
  }
}

async function finalizeRequest(protocolNumber) {
  try {
    // Substitua pelo URL do seu endpoint específico
    const url = `https://api.minhaempresa.com/solicitacoes/finalizar/${protocolNumber}`;

    const response = await fetch(url, {
      method: 'POST', // Or 'PUT', dependendo da API

      headers: {
        'Content-Type': 'application/json',
        // Incluir outros cabeçalhos necessários, como tokens de autenticação
      },
      // Se necessário, inclua o corpo da solicitação. Exemplo:
      // body: JSON.stringify({ status: 'finalizada' }),
    });

    if (response.ok) {
      console.log('Solicitação finalizada com sucesso.');
      displayMessage('Solicitação finalizada com sucesso.'); // Add
    } else {
      console.error('Falha ao finalizar a solicitação.');
      displayMessage('Falha ao finalizar a solicitação.'); // Add
    }
  } catch (error) {
    console.error('Erro ao tentar finalizar a solicitação:', error);
    displayMessage('Erro ao tentar finalizar a solicitação: ' + error); // Add
  }
}

function displayMessage(message) {
  // Implementar lógica para exibir mensagens ao usuário
}

/**
 * 
Fornece sugestões ao usuário, combinando a lógica das funções provideSuggestions e generateSuggestions.
 * @param {Element} field O campo para o qual serão fornecidas sugestões.
 * @param {Object} [options] Opções para controlar o comportamento da função.
 * @param {boolean} [options.useGenerateMethod=false] If true, uses the specific logic of generateSuggestions.
 */
function unifiedSuggestions(field, options = {}) {
  const { useGenerateMethod = false } = options;

  // Lógica comum para preparar o campo ou sugestões
  // ...

  if (useGenerateMethod) {
    // Lógica específica de generateSuggestions
    // ...
  } else {
    // Lógica específica de provideSuggestions
    // ...
  }

  // Lógica comum para aplicar as sugestões
  // ...
}

// Example usage
unifiedSuggestions(document.querySelector('#myField'), { useGenerateMethod: true });

async function getCopilotResponse(question) {
  const response = await fetch('https://api.microsoftcopilot.com/v1/completions', { // Hypothetical URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your_access_token'
    },
    body: JSON.stringify({
      prompt: question,
      max_tokens: 100,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

async function handleQuestion(text) {
  if (text.includes("como") || text.includes("o que é") || text.includes("por que")) {
    const answer = await getCopilotResponse(text);
    console.log(answer); // Display the answer
    return 'question';
  }
  // Outras condições e devoluções conforme necessário
}

function displaySuggestions(suggestions, field) {
  const suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';

  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.style.display = 'flex';
    suggestionElement.style.alignItems = 'center';

    const robotImage = document.createElement('img');
    robotImage.src = chrome.runtime.getURL('images/robot-png_260997.png');
    robotImage.alt = 'Robot face';

    const suggestionText = document.createElement('p');
    suggestionText.innerText = suggestion;

    suggestionElement.appendChild(robotImage);
    suggestionElement.appendChild(suggestionText);
    suggestionsContainer.appendChild(suggestionElement);
  });

  const fieldRect = field.getBoundingClientRect();
  suggestionsContainer.style.top = `${window.scrollY + fieldRect.bottom + 10}px`;
  suggestionsContainer.style.left = `${window.scrollX + fieldRect.left}px`;
}


