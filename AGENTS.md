# AGENTS.md — Instrucciones para generar la presentación del TFM con reveal.js

## Objetivo
Construir una **presentación web de alto impacto visual** a partir de `slides.md`, orientada a una **defensa académica de TFM** ante profesorado y tribunal.

La presentación debe transmitir:
- rigor académico
- madurez técnica
- claridad narrativa
- estética premium sobria
- sensación de “arquitectura enterprise + ingeniería MLOps + finanzas cuantitativas”

El resultado final debe ser una **presentación HTML basada en `reveal.js`** con:
- transiciones elegantes entre diapositivas
- uso intensivo de **Auto-Animate**
- animaciones progresivas por fragmentos
- layouts consistentes y cinematográficos
- buena legibilidad en proyector
- equilibrio entre contenido técnico y estética

---

## Stack obligatorio
Usa este stack como base:
- **reveal.js** como motor principal de slides
- HTML + CSS + JavaScript
- Markdown de entrada: `slides.md`
- Plugins de reveal.js cuando aporten valor real
- Diseño responsive, pero priorizando formato panorámico 16:9 para proyección

No uses PowerPoint ni Google Slides como base.
No generes una presentación estática tipo PDF como salida principal.

---

## Recomendación de implementación
Crear como mínimo esta estructura:

```text
presentation/
  index.html
  slides.md
  assets/
    images/
    icons/
    diagrams/
  css/
    theme.css
    overrides.css
  js/
    main.js
    animations.js
```

Si hace falta, puedes usar un pequeño preprocesado para convertir `slides.md` en secciones `<section>` compatibles con reveal.js, pero **la fuente de verdad del contenido debe seguir siendo `slides.md`**.

---

## Narrativa obligatoria
La narrativa debe reforzar constantemente esta tesis:

> **La principal aportación del TFM no es un modelo aislado, sino una arquitectura MLOps reusable para industrializar modelos financieros de forma trazable, reproducible y gobernada.**

Eso implica que el peso conceptual debe estar en:
- problema real de industrialización
- arquitectura MLOps propuesta
- Chronos Engine como caso productivo principal
- TYM.MLOpsTemplate como formalización reusable
- Asset Allocation como evidencia de transferibilidad
- gobernanza, trazabilidad y automatización
- resultados como evidencia de ingeniería de plataforma

Nunca presentar el trabajo como una simple colección de scripts, notebooks o pipelines sin hilo conductor.

---

## Tono y estilo visual
### Tono general
- académico
- sobrio
- moderno
- tecnológico
- elegante
- premium, sin parecer marketing agresivo

### Paleta sugerida
- fondo principal: azul muy oscuro / gris antracita
- fondos alternos: degradados muy sutiles azul petróleo / negro azulado
- texto principal: blanco roto
- texto secundario: gris claro
- acentos: cian, azul eléctrico o turquesa suave
- color de énfasis numérico: blanco o cian brillante

### Tipografía
Priorizar tipografías limpias y muy legibles:
- Inter
- Manrope
- IBM Plex Sans
- Aptos / Segoe UI como fallback

### Sensación visual buscada
La presentación debe recordar a una mezcla de:
- defensa de ingeniería
- arquitectura cloud enterprise
- panel ejecutivo técnico
- storytelling visual moderno

---

## Reglas de composición
### Principios
- una idea fuerte por diapositiva
- texto mínimo, valor máximo
- jerarquía tipográfica muy clara
- mucho aire en pantalla
- bloques visuales consistentes
- evitar párrafos largos visibles
- convertir listas en tarjetas, diagramas, KPIs o timelines cuando sea posible

### Distribución
- usar grids limpios de 2 o 3 columnas cuando ayude
- márgenes amplios
- alineaciones muy cuidadas
- destacar cifras y conceptos clave con bloques grandes
- no sobrecargar ninguna slide

### Legibilidad
- todo debe ser legible a distancia en una defensa presencial
- no usar tipografía pequeña para “meter más contenido”
- el texto importante debe poder escanearse en 3–5 segundos

---

## reveal.js — configuración obligatoria
Configura reveal.js con una estética fluida y premium.

### Preferencias de transición
Usar una combinación elegante de:
- `transition: "slide"` o `"convex"` como base
- `backgroundTransition: "fade"`
- `hash: true`
- `controls: true`
- `progress: true`
- `center: true`
- `width: 1600`
- `height: 900`
- `margin: 0.04`
- `minScale: 0.2`
- `maxScale: 2.0`

### Auto-Animate
Usar **Auto-Animate de forma agresiva pero intencional** en slides consecutivas cuando haya continuidad conceptual.

Aplicar `data-auto-animate` especialmente en estas secuencias:
1. problema → solución
2. arquitectura general → detalle por capas
3. Chronos monolítico → Chronos modularizado
4. Template conceptual → estructura reusable
5. Template → Asset Allocation
6. gobernanza → resultados
7. resultados → conclusiones

### Fragmentos
Usar `fragment` para:
- revelado progresivo de bullets
- aparición de bloques KPI
- secuencias de diagrama
- comparativas Antes / Después
- conclusiones escalonadas

No abusar de fragmentos cuando ralenticen demasiado la defensa.

---

## Tipo de animaciones deseadas
### Animaciones que sí
- fades suaves
- desplazamientos cortos y elegantes
- escalado ligero
- morphing visual gracias a Auto-Animate
- aparición progresiva de tarjetas
- resaltado secuencial de bloques arquitectónicos
- transición entre versiones de un mismo diagrama

### Animaciones que no
- efectos cómicos o recargados
- giros estridentes
- rebotes excesivos
- animaciones largas que distraigan
- transiciones tipo feria / PowerPoint antiguo

### Regla de oro
La animación debe **reforzar la comprensión**, no competir con el contenido.

---

## Estructura esperada de slides
La presentación debe seguir esta estructura base:

1. Portada
2. Contexto, problema y motivación
3. Objetivos, alcance y aportación del TFM
4. Arquitectura y enfoque MLOps propuesto
5. Contratos, componentes y ciclo de vida del modelo
6. Caso de estudio 1: Chronos Engine
7. Chronos Engine: industrialización y cobertura funcional
8. Estandarización con TYM.MLOpsTemplate
9. TYM.MLOpsTemplate: CI/CD y diseño reusable
10. Caso de validación: Asset Allocation
11. Asset Allocation: evidencia de transferencia
12. Gobernanza, trazabilidad y automatización
13. Resultados obtenidos
14. Conclusiones
15. Líneas futuras
16. Cierre / preguntas

Puedes fusionar o dividir una pequeña cantidad de slides si mejora mucho el ritmo, pero sin perder estos bloques narrativos.

---

## Slides con prioridad máxima de impacto visual
Estas diapositivas deben sentirse especialmente memorables:

### 1. Arquitectura y enfoque MLOps propuesto
Diseñar una slide muy visual con diagrama protagonista.
Usar Auto-Animate para pasar de vista macro a detalle por capas.

### 2. Chronos Engine: industrialización
Mostrar claramente el paso de monolito a arquitectura modular.
Ideal una secuencia antes/después con morphing.

### 3. TYM.MLOpsTemplate
Presentarla como blueprint reusable o columna vertebral de plataforma.
Debe transmitir estandarización, reutilización y escalabilidad.

### 4. Resultados obtenidos
Usar KPIs grandes, bloques comparativos y layout ejecutivo.

### 5. Conclusiones
Slide limpia, contundente y muy segura, con 4–5 mensajes finales de gran impacto.

---

## Recursos visuales obligatorios por tipo
### Diagramas
Priorizar diagramas limpios, minimalistas y consistentes para:
- arquitectura global
- flujo CI/CD
- ciclo de vida de modelo
- modularización de Chronos
- capas de la plantilla
- gobernanza MLflow / Teradata / AML

### KPIs
Usar números grandes y visualmente destacados para:
- 44 pipelines YAML
- 25 componentes YAML
- 9 perfiles de cartera
- cobertura E2E
- coste observado del periodo si se incluye

### Tarjetas
Usar tarjetas visuales para:
- objetivos específicos
- conclusiones
- líneas futuras
- fortalezas / riesgos / controles

### Comparativas
Usar layouts comparativos para:
- antes vs después
- monolito vs modular
- caso productivo vs plantilla reusable
- plantilla vs caso de validación

---

## Instrucciones específicas de reveal.js + Auto-Animate
### Regla base
Siempre que dos slides consecutivas compartan concepto, intenta reutilizar:
- mismos bloques
- mismos títulos
- mismas posiciones
- mismos identificadores o estructura DOM

para que Auto-Animate produzca una transición fluida.

### Casos concretos
#### Problema → solución
Primera slide: caos, notebooks, scripts, poca trazabilidad.
Segunda slide: esos mismos bloques se recolocan y transforman en una arquitectura ordenada.

#### Arquitectura macro → detalle
Slide 1: arquitectura global completa.
Slide 2: mantener el diagrama, pero destacar capas o flujo principal con zoom visual y reubicación.

#### Chronos
Slide 1: mostrar monolito o flujo poco desacoplado.
Slide 2: mismos bloques convertidos en componentes AML encadenados.

#### Template
Slide 1: visión conceptual de estándar reusable.
Slide 2: evolución a estructura por capas, CI/CD y contratos.

#### Resultados → conclusiones
Los KPIs y bloques de evidencia deben transformarse en afirmaciones de cierre.

---

## Buenas prácticas de implementación
### HTML
- estructura semántica clara
- cada slide en `<section>`
- usar clases reutilizables y consistentes
- no incrustar estilos caóticos dentro de cada slide

### CSS
- separar tema global y overrides
- crear utilidades para grids, KPI cards, callouts, timelines y diagram blocks
- usar sombras suaves, bordes finos y transparencias sutiles
- evitar estilos muy ruidosos

### JS
- inicialización limpia de reveal.js
- encapsular animaciones y comportamientos extra en `animations.js`
- no añadir complejidad gratuita
- cualquier extra visual debe poder desactivarse sin romper la presentación

---

## Elementos visuales opcionales recomendados
Puedes añadir, si mejora el resultado:
- fondo con gradiente dinámico muy sutil
- partículas mínimas o glow tecnológico ligero
- líneas de conexión animadas muy discretas
- rejillas o halos suaves en slides arquitectónicas
- pequeños iconos vectoriales consistentes

No conviertas la presentación en una demo visual que distraiga del tribunal.

---

## Qué evitar
- exceso de texto visible
- demasiados bullets tradicionales
- capturas de pantalla ilegibles
- diagramas sobrecargados
- animaciones espectaculares pero inútiles
- demasiados colores
- demasiadas fuentes
- look de template genérico sin personalidad
- estética startup/comercial agresiva

---

## Calidad académica obligatoria
La presentación debe ayudar a maximizar la nota del TFM. Para ello, debe reforzar explícitamente:
- existencia de un problema real y relevante
- claridad de objetivos
- aportación propia y diferenciada
- diseño metodológico coherente
- evidencia de implementación real
- validación en más de un caso
- reflexión crítica y líneas futuras razonables

El tribunal debe percibir que:
1. el trabajo tiene profundidad técnica,
2. existe una aportación arquitectónica reusable,
3. la solución está razonada y validada,
4. el autor entiende tanto el detalle técnico como la visión de plataforma.

---

## Guía de ritmo para la defensa
La presentación debe sentirse fluida y premium.
Ritmo recomendado:
- inicio fuerte y limpio
- problema muy claro
- arquitectura visual potente
- desarrollo técnico por casos
- validación y gobernanza
- resultados sintetizados con autoridad
- cierre seguro y elegante

Las animaciones deben ayudar al relato oral, permitiendo al presentador guiar la atención del tribunal paso a paso.

---

## Criterio final de éxito
La presentación será correcta solo si cumple simultáneamente estas condiciones:

- se ve moderna y visualmente excelente
- mantiene sobriedad académica
- transmite una historia coherente
- usa reveal.js con transiciones y Auto-Animate de forma realmente valiosa
- convierte `slides.md` en una defensa memorable
- pone en primer plano la aportación del TFM como **arquitectura MLOps reusable**

---

## Entregable esperado
Generar una presentación reveal.js ejecutable localmente, con:
- `index.html`
- estilos propios
- scripts propios
- assets organizados
- contenido derivado de `slides.md`

Debe quedar lista para abrir en navegador y exponer.
