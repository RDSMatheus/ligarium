# 🎮 Como Funciona o Efeito 3D Inclinado no Game Board

## 1️⃣ **Container Pai (Game.tsx - linhas 122-159)**

```tsx
<div
  className="relative w-full h-dvh overflow-visible"
  style={{
    fontFamily: "Cinzel,Georgia,serif",
    // ─────────────────────────────────────────────────────────────
    // PARTE 1: Define o espaço 3D
    // ─────────────────────────────────────────────────────────────
    perspective: "800px",           // 👈 Cria o "espaço 3D"
                                    //    Quanto menor = mais dramático
                                    //    (800px é bem visível)

    perspectiveOrigin: "50% 100%",  // 👈 Ponto de vista está NO FUNDO
                                    //    (50% = centro horizontal)
                                    //    (100% = na base, onde jogador está)
                                    //    Assim a inclinação vem do ponto de vista do player

    // ─────────────────────────────────────────────────────────────
    // PARTE 2: Fundo visual
    // ─────────────────────────────────────────────────────────────
    background: `...madeira...`,
  }}
>
```

### 📐 O que é `perspective`?

- **Define um espaço 3D** onde transforms podem acontecer
- **Valor em px** = distância entre você (espectador) e o plano do elemento
  - `perspective: 800px` = você está 800px "na frente" do board
  - Quanto menor o valor, mais exagerado o efeito 3D

### 🎯 O que é `perspectiveOrigin`?

- **Define ONDE você está olhando**
- `50% 100%` = você está no **centro horizontal, na base** (onde o player senta)
- Por isso a inclinação "sai" da base e vai subindo para longe

---

## 2️⃣ **Container Interno (Grid Principal - linhas 157-162)**

```tsx
<div
  className="relative z-10 h-screen px-5 py-3 gap-2"
  style={{
    // ─────────────────────────────────────────────────────────────
    // PARTE 3: A ROTAÇÃO 3D
    // ─────────────────────────────────────────────────────────────
    transform: "rotateX(12deg)",    // 👈 INCLINA 12 graus no eixo X
                                    //    eixoX = horizontal (inclinação de cima/baixo)
                                    //    rotateX(12deg) = tilt para cima
                                    //    (positivo = para cima, negativo = para baixo)

    transformStyle: "preserve-3d",  // 👈 PROPAGA o efeito para os filhos
                                    //    Sem isso, filhos ficam 2D normais

    transformOrigin: "50% 100%",    // 👈 Rotação ocorre A PARTIR DA BASE
                                    //    (mesma posição da perspectiveOrigin)
  }}
>
```

### 🔄 Como funciona `rotateX(12deg)`?

```
Sem rotação:          Com rotateX(12deg):      (visto em perspectiva 800px)

┌─────────────┐      ╱─────────────╲
│   Board     │   → │   Board       │  ← topo fica mais longe
│             │      │               │
└─────────────┘      └───────────────┘   ← base fica mais perto (perto de você)
```

### ⚙️ `transformStyle: preserve-3d`?

- **SEM isto**: cada filho é 2D, o efeito 3D morre ali
- **COM isto**: filhos herdam o espaço 3D e podem ser rotacionados também

---

## 3️⃣ **Componentes que Ficar RETOS (sem inclinação)**

```tsx
{/* ─────────────────────────────────────────────────────────────
    CONTRA-ROTAÇÃO: Anula o efeito da rotação pai
    ───────────────────────────────────────────────────────────── */}

{/* 🎴 InfoCard (lateral esquerda) */}
<div
  className="col-start-1 row-start-1 row-span-3"
  style={{
    transform: "rotateX(-12deg)",   // 👈 INVERSO da rotação pai (+12 → -12)
                                    //    Anula o tilt, fica reto
    transformStyle: "preserve-3d",
  }}
>
  <InfoCard />
</div>

{/* 👤 PlayerPanel Opponent (topo) */}
<div
  className="grid gap-4"
  style={{
    transform: "rotateX(-12deg)",   // 👈 CONTRA-ROTAÇÃO
    transformStyle: "preserve-3d",
  }}
>
  <PlayerPanel playerField={oppState} playerInfo={opp} isOpponent />
  ...
</div>

{/* 👤 PlayerPanel Player (base) */}
<div
  className="grid gap-4"
  style={{
    transform: "rotateX(-12deg)",   // 👈 CONTRA-ROTAÇÃO
    transformStyle: "preserve-3d",
  }}
>
  <PlayerPanel isOpponent={false} ... />
  ...
</div>
```

### 🔓 Por que `-12deg` anula `+12deg`?

```
Pai inclina +12deg (tilt para cima)
  └─ Filho com -12deg (tilt para baixo)
     = Filho volta ao normal (0deg efetivo)

É como: 12 + (-12) = 0 ✓
```

---

## 📊 Hierarquia Completa

```
Game (perspectiva: 800px, origin: 50% 100%)
  └─ Grid Principal (rotateX: 12deg, preserve-3d, origin: 50% 100%)
      ├─ PlayerPanel Opponent (rotateX: -12deg) ← RETO
      │
      ├─ BattleZone (herda +12deg) ← INCLINADO ✓
      ├─ MainZone (herda +12deg) ← INCLINADO ✓
      │
      ├─ InfoCard (rotateX: -12deg) ← RETO
      │
      └─ PlayerPanel Player (rotateX: -12deg) ← RETO
```

---

## 🎨 Visual Resultado

```
Visão de cima (sem perspectiva):
┌─────┬──────────────┬─────┐
│ OPP │  MAIN ZONE   │ INF │
│ PLY │              │ OCA │
├─────┤──────────────┤     │
│ INF │ BATTLE ZONE  │     │
│ OCA │              │     │
├─────┤──────────────┤     │
│ TER │  MAIN ZONE   │     │
│ PLY │              │     │
└─────┴──────────────┴─────┘

Visão em perspectiva (com rotateX 12deg + perspectiva 800px):
       ╱────────────────────╲
      │  MAIN ZONE OPONENTE  │ ← Parece distante
      │  BATTLE ZONE         │ ← Centro inclinado ⬆
      │  MAIN ZONE PLAYER    │
      └────────────────────╱

    OPP  INF  PLY  ← Ficam RETOS (sem inclinação)
    PLY  OCA  PLY
```

---

## 🔧 Como Aumentar/Diminuir Inclinação?

No **Grid Principal** (linhas 157-162), mude `rotateX(12deg)`:

```tsx
transform: "rotateX(8deg)",    // Menos inclinado
transform: "rotateX(12deg)",   // Normal (atual)
transform: "rotateX(18deg)",   // Mais inclinado
transform: "rotateX(25deg)",   // Bem dramático
```

E **atualize também** a contra-rotação nos PlayerPanel/InfoCard:

```tsx
transform: "rotateX(-8deg)",   // Se mudou para -8
transform: "rotateX(-12deg)",  // Se mantém -12
transform: "rotateX(-18deg)",  // Se mudou para -18
```

---

## ✅ Resumo da "Mágica"

| Propriedade         | Função                | Valor Atual                         |
| ------------------- | --------------------- | ----------------------------------- |
| `perspective`       | Define espaço 3D      | `800px`                             |
| `perspectiveOrigin` | Onde você olha        | `50% 100%` (base)                   |
| `rotateX()`         | Inclina no eixo X     | `12deg` (board) / `-12deg` (painel) |
| `transformStyle`    | Propaga 3D aos filhos | `preserve-3d`                       |
| `transformOrigin`   | De onde rotaciona     | `50% 100%` (base)                   |

**Sem nenhum desses = nada funciona!** Todos são essenciais. 🎯
