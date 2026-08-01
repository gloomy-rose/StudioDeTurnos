# 🎭 Studio de Turnos

Um editor HTML criado para facilitar a criação de turnos em RPGs de fórum.

O objetivo é permitir escrever normalmente no Google Docs (ou outro editor de texto), copiar o conteúdo e transformá-lo automaticamente em HTML compatível com o fórum.

---

## ✨ Funcionalidades

- 📝 Conversão de texto formatado para HTML
- 🎨 Preserva:
  - Negrito
  - Itálico
  - Sublinhado
  - Cores
- 📑 Criação automática de parágrafos
- 📏 Recuo da primeira linha configurável
- 📚 Texto justificado (opcional)
- 👤 Gerenciamento de personagens
- 💾 Personagens salvos automaticamente no navegador
- 📤 Exportação e importação da biblioteca de personagens
- 👀 Pré-visualização do HTML
- 📋 Copiar HTML com um clique

---

# 👥 Personagens

Cada personagem possui seu próprio modelo HTML.

São armazenados:

- Nome
- Template HTML
- Cor do link da ficha
- Link da ficha
- Cor padrão das falas (caso utilizada futuramente)

---

# 🏷️ Variáveis disponíveis

As variáveis abaixo podem ser utilizadas dentro do HTML do personagem.

## Texto

```html
{{TEXTO}}
```

Insere todo o turno formatado.

---

## Informações Extras

```html
{{EXTRAS}}
```

Insere informações adicionais sem criar parágrafos.

Exemplo:

- Rolagens
- Observações
- Dados
- Avisos

---

## Link da ficha

```html
{{FICHA}}
```

Substituído automaticamente pelo link informado.

---

## Cor do link da ficha

```html
{{COR_FICHA}}
```

Exemplo:

```html
<a href="{{FICHA}}" style="color:{{COR_FICHA}}">
    FICHA
</a>
```

---

## Nome

```html
{{NOME}}
```

Substituído pelo nome do personagem.

---

# ✍️ Como usar

## 1.

Crie um personagem.

---

## 2.

Cole o HTML do personagem.

Exemplo:

```html
<div>

{{TEXTO}}

{{EXTRAS}}

</div>
```

---

## 3.

Informe o link da ficha.

---

## 4.

Escolha a cor do link da ficha.

---

## 5.

Escreva normalmente no Google Docs.

---

## 6.

Copie o texto.

---

## 7.

Cole no Studio de Turnos.

---

## 8.

Clique em **Formatar HTML**.

---

## 9.

Copie o resultado.

---

# 📋 Informações Extras

Ao habilitar:

```
Adicionar informações extras
```

um novo campo aparecerá.

Ele aceita:

- negrito
- itálico
- sublinhado
- cores
- quebras de linha

Porém **não cria `<p>`**, mantendo apenas `<br>` quando necessário.

Ideal para:

```
ROLAGEM

Atletismo: 17

Observação:
Recebe bônus de +2.
```

---

# 💾 Backup

É possível exportar toda a biblioteca de personagens em um arquivo JSON.

Esse backup contém:

- personagens
- templates
- configurações

Também é possível importar esse arquivo posteriormente.

---

# 📂 Estrutura

```
Studio de Turnos

├── Formatar turno
├── Personagens
├── Configurações
└── Backup
```

---

# 🛠️ Tecnologias

- HTML
- CSS
- JavaScript (Vanilla)

Sem dependências externas.

---

# 📌 Observações

O programa foi desenvolvido pensando em textos copiados diretamente do Google Docs.

Diversas estruturas geradas pelo Google Docs são tratadas automaticamente para preservar:

- parágrafos
- cores
- negrito
- itálico
- sublinhado

---

Desenvolvido por Gloomy.
