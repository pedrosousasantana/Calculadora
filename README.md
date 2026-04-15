# CalcCientífica

Calculadora científica avançada com gráfico de funções, limite, derivada, integral e série de Taylor — tudo rodando no browser, sem backend.

![screenshot](https://via.placeholder.com/900x500/0e0f11/5b8cff?text=CalcCientifica)

## Funcionalidades

### Calculadora
- Operações básicas: `+` `−` `×` `÷` `%`
- Funções: `sin` `cos` `tan` (e inversas com INV)
- Logaritmos: `log₁₀`, `ln`, `10ˣ`, `eˣ`
- Potência `xʸ`, raiz quadrada `√`, quadrado `x²`
- Fatorial `n!`
- Constantes `π` e `e`
- Alternância **DEG / RAD**
- Histórico de cálculos (clicável)
- Suporte a teclado físico

### Gráfico
- Plota `f(x)` e/ou `f'(x)` em tempo real
- Controle de intervalo `[xmín, xmáx]`
- Grade automática com labels nos eixos
- Responsivo

### Ferramentas de Cálculo
| Ferramenta | Método |
|---|---|
| **Limite** | Aproximação bilateral — detecta limites inexistentes |
| **Derivada** | Diferença centrada de ordem n (n = 1..4) |
| **Integral definida** | Regra de Simpson com 2000 subdivisões |
| **Série de Taylor** | Derivadas numéricas + coeficientes `f⁽ⁿ⁾(x₀)/n!` |

## Como usar

### Opção 1 — Abrir direto no browser
Faça clone ou baixe o ZIP e abra `index.html` no navegador.

```bash
git clone https://github.com/seu-usuario/scientific-calculator.git
cd scientific-calculator
# abra index.html no browser (duplo clique ou Live Server)
```

### Opção 2 — Live Server (VS Code)
Instale a extensão **Live Server** no VS Code, clique com o botão direito em `index.html` → *Open with Live Server*.

### Opção 3 — GitHub Pages
1. Vá em **Settings → Pages**
2. Source: `Deploy from a branch` → `main` → `/ (root)`
3. Acesse `https://seu-usuario.github.io/scientific-calculator`

## Estrutura

```
scientific-calculator/
├── index.html      # estrutura HTML
├── style.css       # estilos (tema escuro industrial)
├── calc.js         # lógica da calculadora
├── graph.js        # renderização do gráfico (Canvas API)
├── calculus.js     # limite, derivada, integral, Taylor
└── README.md
```

## Dependências externas

Apenas uma, carregada via CDN (sem npm, sem build):

- **[math.js](https://mathjs.org/)** `v12.4.0` — avaliação segura de expressões matemáticas

## Sintaxe das expressões

Use a notação do math.js nas ferramentas de cálculo:

```
sin(x)          cos(x)          tan(x)
x^2 + 3*x - 1   sqrt(x)         log(x, 10)
exp(x)          abs(x)          pi    e
```

## Licença

MIT — fique à vontade para usar, modificar e distribuir.
