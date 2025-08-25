const port = 8081;
let isFirstRender = true;

// Simple HTML sanitization to prevent XSS vulnerabilities.
function sanitizeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function render(document, todos) {
  if (typeof window !== "undefined" && window.performance && window.performance.navigation.type === 1) {
    isFirstRender = true;
  }

  if (isFirstRender) {
    const jsonResponse = await fetch(`http://localhost:${port}/data`);
    const imageResponse = await fetch(`http://localhost:${port}/image`);
    if (jsonResponse.ok && imageResponse.ok) {
      const jsonData = await jsonResponse.json();
      const todos = jsonData;
      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      let html = `<html><body><img src=${imageUrl} alt='image'></body></html>`;  
      html += "<ul>";  
      for (const item of todos) {
        html += `<li>${sanitizeHtml(item)}</li>`;
      }
      html += "</ul><input>";
      html += "<button>Add</button></body></html>";
      document.body.innerHTML = html;
      isFirstRender = false;
    } else {
      document.body.innerHTML = "<html><body><p>Something went wrong.</p></body></html>";
    }
  } else {
    const ulElement = document.querySelector("ul");
    if (ulElement) {
      let html = "<ul>";
      for (const item of todos) {
        html += `<li>${sanitizeHtml(item)}</li>`;
      }
      html += "</ul>";
      ulElement.outerHTML = html;
    } else {
      isFirstRender = true;
      render(document, todos);
    }
  }
}

export function addEventListeners() {
  document.querySelector("button").addEventListener("click", async () => {
    const item = document.querySelector("input").value;
    const todos = Array.from(document.querySelectorAll("li"), e => e.innerText);
    todos.push(item);
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item }),
    });
    if (response.ok) {
      render(document, todos);
    } else {
      console.error("Something went wrong.");
    }
  });
}