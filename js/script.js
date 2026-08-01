    const STORAGE_KEY = "studioTurnosDataV1";

    const defaultTemplate = `<div title="ʜᴛᴍʟ ʙʏ: ɢʟᴏᴏᴍʏ." style="background: #481873;padding:16px;text-align:justify;font-size:13px;font-family:Verdana;border: solid #10041d;color:#000;margin:13px 30px;">

<div style="background: #12031e;padding:6px;color:#f2ede3;margin-top: 0px;border-left: 4px solid #12031e;border-right: 4px solid #12031e;">
     <div style="border:1px solid #a3a3a3;padding:5px;text-align:center;font-family:cambria;font-size:13px;text-transform:uppercase;">  <b style="font-style:italic;font-size:15px;">JANE DOE</b> |  Info 1  |  Info 2   |  Info 3  |  Info 4  ♦ <a href="{{FICHA}}" style="color:{{COR_FICHA}}">FICHA</a></div>
</div>
      <div style="border:4px solid #f2ede3;padding:20px;background:#e3e3e3;border-bottom: #12031e solid 9px;">
{{TEXTO}}

</div>

</div>`;

    const initialData = {
      selectedCharacterId: "janedoe",
      characters: [{
        id: "janedoe", 
        name: "Jane Doe",
        color: "#a930b4",
        marker: "{{TEXTO}}",
        sheetLink: "",
        sheetColor:"#f2edd1",
        template: defaultTemplate
      }],
      settings: {
        paragraphMode: "styled",
        indentSize: 30,
        indentUnit: "px",
        textAlign: "justify",
        useHex: true,
        keepItalic: true,
        keepUnderline: true,
        blankLine: true
      }
    };

    let data = loadData();
    let currentCharacterId = data.selectedCharacterId;

    const editor = document.getElementById("editor");
    const output = document.getElementById("output");
    const preview = document.getElementById("preview");
    const status = document.getElementById("status");
    const characterSelect = document.getElementById("characterSelect");
    const characterList = document.getElementById("characterList");

    function loadData() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return saved && saved.characters ? saved : structuredClone(initialData);
      } catch {
        return structuredClone(initialData);
      }
    }

    function saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function showStatus(el, message, type = "success") {
      el.textContent = message;
      el.className = `status ${type}`;
    }

    document.querySelectorAll(".tab-button").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
      });
    });

    function getCurrentCharacter() {
      return data.characters.find(c => c.id === currentCharacterId) || data.characters[0];
    }

    function renderCharacters() {
      characterSelect.innerHTML = "";
      characterList.innerHTML = "";

      data.characters.forEach(character => {
        const option = document.createElement("option");
        option.value = character.id;
        option.textContent = character.name;
        characterSelect.appendChild(option);

        const button = document.createElement("button");
        button.className = "character-item" + (character.id === currentCharacterId ? " active" : "");
        button.textContent = character.name;
        button.addEventListener("click", () => selectCharacter(character.id));
        characterList.appendChild(button);
      });

      characterSelect.value = currentCharacterId;
      fillCharacterForm();
    }

    function selectCharacter(id) {
      currentCharacterId = id;
      data.selectedCharacterId = id;
      saveData();
      renderCharacters();
    }

    characterSelect.addEventListener("change", () => selectCharacter(characterSelect.value));

    function fillCharacterForm() {
      const c = getCurrentCharacter();
      document.getElementById("characterName").value = c.name || "";
      document.getElementById("characterColor").value = c.color || "#000000";
      document.getElementById("characterColorText").value = c.color || "#000000";
      document.getElementById("textMarker").value = c.marker || "{{TEXTO}}";
      document.getElementById("sheetLink").value = c.sheetLink || "";
      document.getElementById("sheetColor").value = c.sheetColor || "#f2edd1";
      document.getElementById("sheetColorText").value = c.sheetColor || "#f2edd1";
      document.getElementById("templateHtml").value = c.template || "";
    }

    document.getElementById("characterColor").addEventListener("input", e => {
      document.getElementById("characterColorText").value = e.target.value;
    });

    
    document.getElementById("sheetColor").addEventListener("input", e=>{
      document.getElementById("sheetColorText").value=e.target.value;
    });
    document.getElementById("sheetColorText").addEventListener("input", e=>{
      if(/^#[0-9a-f]{6}$/i.test(e.target.value)){
        document.getElementById("sheetColor").value=e.target.value;
      }
    });

    document.getElementById("characterColorText").addEventListener("input", e => {
      if (/^#[0-9a-f]{6}$/i.test(e.target.value)) {
        document.getElementById("characterColor").value = e.target.value;
      }
    });

    document.getElementById("newCharacterBtn").addEventListener("click", () => {
      const id = "char_" + Date.now();
      data.characters.push({
        id,
        name: "Novo personagem",
        color: "#7c3aed",
        marker: "{{TEXTO}}",
        sheetLink: "",
        sheetColor:"#f2edd1",
        template: `<div style="padding:20px;border:1px solid #ccc;">\n{{TEXTO}}\n</div>`
      });
      selectCharacter(id);
    });

    document.getElementById("duplicateCharacterBtn").addEventListener("click", () => {
      const original = getCurrentCharacter();
      const copy = {
        ...original,
        id: "char_" + Date.now(),
        name: original.name + " — cópia"
      };
      data.characters.push(copy);
      selectCharacter(copy.id);
    });

    document.getElementById("saveCharacterBtn").addEventListener("click", () => {
      const c = getCurrentCharacter();
      c.name = document.getElementById("characterName").value.trim() || "Sem nome";
      c.color = document.getElementById("characterColorText").value.trim() || "#000000";
      c.marker = document.getElementById("textMarker").value.trim() || "{{TEXTO}}";
      c.sheetLink = document.getElementById("sheetLink").value.trim();
      c.sheetColor=document.getElementById("sheetColorText").value.trim()||"#f2edd1";
      c.template = document.getElementById("templateHtml").value;
      saveData();
      renderCharacters();
      alert("Personagem salvo.");
    });

    document.getElementById("deleteCharacterBtn").addEventListener("click", () => {
      if (data.characters.length === 1) {
        alert("É necessário manter pelo menos um personagem.");
        return;
      }
      if (!confirm("Excluir este personagem e seu modelo HTML?")) return;
      data.characters = data.characters.filter(c => c.id !== currentCharacterId);
      currentCharacterId = data.characters[0].id;
      data.selectedCharacterId = currentCharacterId;
      saveData();
      renderCharacters();
    });

    function applySettingsToForm() {
      const s = data.settings;
      document.getElementById("paragraphMode").value = s.paragraphMode;
      document.getElementById("indentSize").value = s.indentSize;
      document.getElementById("indentUnit").value = s.indentUnit;
      document.getElementById("textAlign").value = s.textAlign;
      document.getElementById("useHex").checked = s.useHex;
      document.getElementById("keepItalic").checked = s.keepItalic;
      document.getElementById("keepUnderline").checked = s.keepUnderline;
      document.getElementById("blankLine").checked = s.blankLine;
    }

    document.getElementById("saveSettingsBtn").addEventListener("click", () => {
      data.settings = {
        paragraphMode: document.getElementById("paragraphMode").value,
        indentSize: Number(document.getElementById("indentSize").value) || 0,
        indentUnit: document.getElementById("indentUnit").value,
        textAlign: document.getElementById("textAlign").value,
        useHex: document.getElementById("useHex").checked,
        keepItalic: document.getElementById("keepItalic").checked,
        keepUnderline: document.getElementById("keepUnderline").checked,
        blankLine: document.getElementById("blankLine").checked
      };
      saveData();
      showStatus(document.getElementById("settingsStatus"), "Configurações salvas.");
    });

    function escapeHtml(text) {
      return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    function normalizeColor(color) {
      if (!color) return "";
      const probe = document.createElement("span");
      probe.style.color = color;
      probe.style.display = "none";
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();

      if (!data.settings.useHex) return computed;
      const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!match) return color;

      return "#" + [match[1], match[2], match[3]]
        .map(value => Number(value).toString(16).padStart(2, "0"))
        .join("");
    }

    function isBold(element, computed) {
      const tag = element.tagName.toLowerCase();
      const weight = computed.fontWeight;
      return tag === "b" || tag === "strong" || weight === "bold" || Number.parseInt(weight, 10) >= 600;
    }

    function processInline(node) {
      if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const tag = node.tagName.toLowerCase();
      if (["script", "style", "meta", "link", "iframe", "object"].includes(tag)) return "";
      if (tag === "br") return "<br>";

      let result = Array.from(node.childNodes).map(processInline).join("");
      const computed = getComputedStyle(node);
      const bold = isBold(node, computed);
      const italic = data.settings.keepItalic && ["i", "em"].includes(tag) || (data.settings.keepItalic && ["italic", "oblique"].includes(computed.fontStyle));
      const underlined = data.settings.keepUnderline && (tag === "u" || computed.textDecorationLine.includes("underline"));
      const color = normalizeColor(computed.color);
      const hasColor = color && !["#000000", "rgb(0, 0, 0)"].includes(color.toLowerCase());

      if (underlined) result = `<u>${result}</u>`;
      if (italic) result = `<i>${result}</i>`;

      if (bold && hasColor) result = `<b style="color: ${color};">${result}</b>`;
      else if (bold) result = `<b>${result}</b>`;
      else if (hasColor) result = `<span style="color: ${color};">${result}</span>`;

      return result;
    }

  function splitIntoParagraphs() {
    const blocks = [];
    let current = [];

    const blockTags = new Set([
      "p",
      "div",
      "section",
      "article",
      "blockquote",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6"
    ]);

    const blockSelector = Array.from(blockTags).join(",");

    function flush() {
      const html = current.join("").trim();

      const text = html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim();

      if (text) {
        blocks.push(html);
      }

      current = [];
    }

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;

        if (!text) return;

        const parts = text.split(/\n\s*\n/);

        parts.forEach((part, index) => {
          if (part.trim()) {
            current.push(escapeHtml(part));
          }

          if (index < parts.length - 1) {
            flush();
          }
        });

        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const tag = node.tagName.toLowerCase();

      if (
        ["script", "style", "meta", "link", "iframe", "object"].includes(tag)
      ) {
        return;
      }

      if (tag === "br") {
        if (current.join("").endsWith("<br>")) {
          flush();
        } else {
          current.push("<br>");
        }

        return;
      }

      const containsBlockElements = Boolean(
        node.querySelector(blockSelector)
      );

      /*
      * Google Docs costuma envolver vários <p> em um span.
      * Quando isso acontecer, percorremos os filhos recursivamente.
      */
      if (!blockTags.has(tag) && containsBlockElements) {
        Array.from(node.childNodes).forEach(walk);
        return;
      }

      if (blockTags.has(tag)) {
        flush();

        /*
        * Uma div do Google Docs também pode conter outros blocos.
        */
        if (containsBlockElements) {
          Array.from(node.childNodes).forEach(walk);
          flush();
          return;
        }

        const content = Array.from(node.childNodes)
          .map(processInline)
          .join("")
          .trim();

        const plainText = content
          .replace(/<br\s*\/?>/gi, " ")
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/gi, " ")
          .trim();

        if (plainText) {
          blocks.push(content);
        }

        return;
      }

      current.push(processInline(node));
    }

    Array.from(editor.childNodes).forEach(walk);

    flush();

    return blocks;
  }

    function applyDialogueDetection(content, color) {
      if (!document.getElementById("autoDialogues").checked) return content;

      const temp = document.createElement("div");
      temp.innerHTML = content;
      const plain = temp.textContent.trim();

      if (!plain.startsWith("—")) return content;

      const useCharacterColor = document.getElementById("useCharacterColor").checked;
      const style = useCharacterColor ? ` style="color: ${color};"` : "";
      return `<b${style}>${content}</b>`;
    }

    function paragraphTag(content) {
      const s = data.settings;
      if (s.paragraphMode === "none") return content;
      if (s.paragraphMode === "plain") return `<p>${content}</p>`;

      const indent = `${Math.max(0, Number(s.indentSize) || 0)}${s.indentUnit}`;
      if (s.paragraphMode === "indent") return `<p style="text-indent: ${indent};">${content}</p>`;
      return `<p style="text-indent: ${indent}; text-align: ${s.textAlign};">${content}</p>`;
    }

    function buildTextHtml() {
      const character = getCurrentCharacter();
      return splitIntoParagraphs()
        .map(content => content.replace(/^(<br>)+|(<br>)+$/g, "").trim())
        .filter(Boolean)
        // .map(content => applyDialogueDetection(content, character.color))
        .map(paragraphTag)
        .join(data.settings.blankLine ? "\n\n" : "\n");
    }

    function buildFullHtml(textHtml) {
      const c = getCurrentCharacter();
      const marker = c.marker || "{{TEXTO}}";
      let result = c.template || marker;

      result = result.split(marker).join(textHtml);
      result = result.split("{{NOME}}").join(c.name || "");
      result = result.split("{{COR}}").join(c.color || "");
      result = result.split("{{FICHA}}").join(c.sheetLink || "#");
      result = result.split("{{COR_FICHA}}").join(c.sheetColor || "#f2edd1");

      return result;
    }

    function formatHtml() {
      if (!editor.innerText.trim()) {
        output.value = "";
        preview.innerHTML = "";
        showStatus(status, "Cole algum texto antes de formatar.", "error");
        return;
      }

      const textHtml = buildTextHtml();
      const fullHtml = buildFullHtml(textHtml);
      const mode = document.getElementById("outputMode").value;

      output.dataset.textHtml = textHtml;
      output.dataset.fullHtml = fullHtml;
      output.value = mode === "text" ? textHtml : fullHtml;
      preview.innerHTML = output.value;

      showStatus(status, "Turno formatado com sucesso.");
    }

    document.getElementById("outputMode").addEventListener("change", () => {
      if (!output.dataset.textHtml) return;
      output.value = document.getElementById("outputMode").value === "text"
        ? output.dataset.textHtml
        : output.dataset.fullHtml;
      preview.innerHTML = output.value;
    });

    document.getElementById("formatBtn").addEventListener("click", formatHtml);

    document.getElementById("copyBtn").addEventListener("click", async () => {
      if (!output.value.trim()) {
        showStatus(status, "Não há HTML para copiar.", "error");
        return;
      }
      try {
        await navigator.clipboard.writeText(output.value);
      } catch {
        output.select();
        document.execCommand("copy");
      }
      showStatus(status, "HTML copiado.");
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
      editor.innerHTML = "";
      output.value = "";
      preview.innerHTML = "";
      output.dataset.textHtml = "";
      output.dataset.fullHtml = "";
      status.textContent = "";
      editor.focus();
    });

    document.getElementById("exampleBtn").addEventListener("click", () => {
      editor.innerHTML = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris gravida fringilla sem quis facilisis. 
Fusce egestas mauris lacus, at convallis arcu fermentum sed. — <b>Fala, chata, fala!</b> — 
Nam sodales purus sapien, eget condimentum libero euismod nec. Pellentesque habitant morbi tristique senectus et 
netus et malesuada fames ac turpis egestas.  
      `;
      formatHtml();
    });

    document.getElementById("downloadBtn").addEventListener("click", () => {
      if (!output.value.trim()) {
        showStatus(status, "Não há HTML para baixar.", "error");
        return;
      }
      const blob = new Blob([output.value], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "turno-formatado.txt";
      link.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "studio-turnos-backup.json";
      link.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("importBtn").addEventListener("click", async () => {
      const file = document.getElementById("importFile").files[0];
      const backupStatus = document.getElementById("backupStatus");

      if (!file) {
        showStatus(backupStatus, "Selecione um arquivo JSON.", "error");
        return;
      }

      try {
        const imported = JSON.parse(await file.text());
        if (!imported.characters || !Array.isArray(imported.characters)) throw new Error();
        data = imported;
        currentCharacterId = data.selectedCharacterId || data.characters[0].id;
        saveData();
        renderCharacters();
        applySettingsToForm();
        showStatus(backupStatus, "Biblioteca importada com sucesso.");
      } catch {
        showStatus(backupStatus, "Arquivo inválido ou incompatível.", "error");
      }
    });

    renderCharacters();
    applySettingsToForm();
