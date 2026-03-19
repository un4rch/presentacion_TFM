# Hacia la operativización de modelos IA aplicados en el ámbito financiero
## Guion detallado para generar una presentación en reveal.js

> **Objetivo de este archivo**: servir como especificación de contenido para que un agente de código genere una presentación visual en reveal.js a partir de la nueva estructura propuesta.
>
> **Tono visual recomendado**: profesional, tecnológico y corporativo. Paleta sobria (azules, blancos, grises), estilo banca/ingeniería. Priorizar diagramas, timelines, tablas comparativas, cifras clave y capturas/figuras del TFM.
>
> **Instrucción general para el agente**: cada bloque separado por `---` corresponde a una diapositiva. Puede sintetizar texto visualmente, pero debe mantener el mensaje principal. Cuando aparezca una instrucción como `(incluir aquí imagen ...)`, debe reutilizar una figura de la memoria o generar un elemento visual equivalente.
>
> **Criterio narrativo**: la presentación debe contar una historia clara y progresiva: problema real -> base existente -> objetivos -> principios -> proceso del TFM -> caso principal -> extracción del estándar -> validación de transferibilidad -> gobernanza -> resultados -> cumplimiento/viabilidad -> cierre.

---

# Portada

<section class="premium-meteor-slide" data-transition="convex">
    <div class="meteor-canvas" aria-hidden="true">
    <span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span>
    <span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span>
    </div>
    <div class="slide-pad hero">
    <p class="eyebrow">Defensa del Trabajo Fin de Master</p>
    <h1>Hacia la operativizacion de modelos IA aplicados en el ambito financiero</h1>
    <p class="subtitle">De ejecuciones ad hoc a una arquitectura MLOps reusable, trazable y gobernada en Laboral Kutxa</p>
    <div class="meta-grid">
        <div><span>Autor</span><strong>Unai Elorriaga Aramburu</strong></div>
        <div><span>Universidad</span><strong>Mondragon Unibertsitatea</strong></div>
        <div><span>Director</span><strong>Unai Barreiro Buezo</strong></div>
        <div><span>Master</span><strong>Analisis de Datos, Ciberseguridad y Computacion en la Nube</strong></div>
        <div><span>Tutor de empresa</span><strong>Oscar Serradilla Casado</strong></div>
        <div><span>Periodo</span><strong>2025-2026</strong></div>
    </div>
    </div>
    <aside class="notes">Abrir con la tesis: el valor no esta solo en predecir, sino en operar con control.</aside>
</section>

---

# Índice

1. Contexto, problemática y motivación
2. Antecedentes
3. Objetivos y competencias
4. Planificación
5. Principios MLOps
6. Proceso del TFM
7. Caso principal: operativización de Chronos Engine
8. Estandarización del despliegue con TYM.MLOpsTemplate
9. Transferabilidad del estándar con Asset Allocation
10. Gobernanza y Trazabilidad en Teradata
11. Resultados obtenidos
12. Marco Legislativo
13. Memoria económica y viabilidad del proyecto
14. Conclusiones
15. Líneas futuras

**Visuales sugeridos**
- (incluir aquí una diapositiva de índice minimalista con bloques horizontales o timeline vertical)

---

# 1. Contexto, problemática y motivación
## El problema operativo

**Mensaje clave**
El TFM aborda una necesidad operativa real: pasar de modelos que funcionan en entorno analítico a modelos operables de forma estable en producción, con control, trazabilidad y reproducibilidad.

**Ideas a mostrar**
- En banca no basta con que el modelo funcione en notebook.
- El valor aparece cuando puede ejecutarse de forma periódica, auditable y mantenible.
- La calidad predictiva por sí sola no garantiza utilidad operativa.

**Bullets sugeridos**
- Dependencias no controladas
- Ejecuciones manuales
- Baja trazabilidad extremo a extremo
- Dificultad para reproducir resultados

**Visuales sugeridos**
- (incluir aquí un diagrama simple “notebook experimental -> operación diaria en banca”)
- (incluir aquí un callout visual con palabras clave: control, trazabilidad, reproducibilidad)

---

# 1. Contexto, problemática y motivación
## Contexto de negocio

**Mensaje clave**
El trabajo se desarrolla en Laboral Kutxa, dentro del área de Tesorería y Mercados, donde los resultados de los modelos deben ser periódicos, auditables y mantenibles.

**Ideas a mostrar**
- Sector regulado -> más exigencia en evidencia técnica.
- Modelos con consumo recurrente por negocio.
- Necesidad de despliegue coherente entre DEV, PRE y PRO.

**Visuales sugeridos**
- (incluir aquí el organigrama o una versión simplificada del encaje del área)
- (incluir aquí iconos de banco, datos, cloud y auditoría)

---

# 1. Contexto, problemática y motivación
## La brecha desarrollo-producción

**Mensaje clave**
La industria reconoce una brecha entre desarrollo y producción: una parte muy relevante de los proyectos de ML no llega a operarse de forma sostenible por problemas de reproducibilidad, gobernanza y escalabilidad.

**Tabla sugerida**
| Indicador | Situación de partida | Situación objetivo |
|---|---|---|
| Tiempo de despliegue por caso | Elevado y dependiente de ajustes manuales | Arranque reproducible con plantilla y contratos comunes |
| Trazabilidad de ejecuciones | Parcial y heterogénea | Evidencia homogénea de versión, run y artefactos |
| Esfuerzo manual por release | Alto | Reducción por automatización CI/CD |
| Recuperación ante incidencias | Ad hoc | Fallback y procedimiento documentado |

**Mensaje final**
El foco del trabajo no es crear “otro modelo”, sino construir una base técnica reusable que reduzca fricción y mejore la gobernanza.

**Visuales sugeridos**
- (incluir aquí una tabla visual elegante)
- (incluir aquí un semáforo antes/después)

---

# 1. Contexto, problemática y motivación
## Motivación y ODS

**Mensaje clave**
La motivación del TFM es reducir dependencia manual y reforzar la trazabilidad técnica del ciclo de vida, alineándolo además con impacto organizativo en innovación, productividad y transparencia.

**Tabla sugerida**
| ODS | Justificación breve |
|---|---|
| ODS 9 | Estandariza la industrialización de modelos con contratos y pipelines reutilizables. |
| ODS 8 | Reduce retrabajo técnico y dependencia de tareas manuales repetitivas. |
| ODS 16 | Refuerza trazabilidad, evidencia auditable y transparencia de ejecuciones. |

**Visuales sugeridos**
- (incluir aquí una pequeña tabla visual con iconos ODS 9, 8 y 16)

---

# 2. Antecedentes
## Punto de partida tecnológico

**Mensaje clave**
El trabajo no parte de cero: ya existía una plataforma MLOps corporativa en Azure con entornos DEV, PRE y PRO, recursos base desplegados y una gobernanza de promoción de cambios.

**Lo que ya existía**
- Workspace operativo en Azure.
- Separación por entornos.
- Datastores y data assets versionados.
- Flujo de despliegue con aprobaciones.
- Al menos un modelo productivizado previamente.

**Visuales sugeridos**
- (incluir aquí la figura de la plataforma MLOps corporativa y esquema de entornos)
- (incluir aquí un diagrama simplificado DEV -> PRE -> PRO)

---

# 2. Antecedentes
## Trabajo previo y gap a resolver

**Mensaje clave**
El antecedente directo es la memoria 2024-2025, que ya había avanzado en metodología MLOps, ingesta automatizada y primeros modelos productivizados; el gap pendiente era consolidar un estándar reusable y una gobernanza más homogénea.

**Qué aportaba el punto de partida**
- Plataforma ADI y arquitectura base en Azure.
- Integración Azure DevOps + Azure ML.
- Flujos iniciales de CI/CD.
- Primeros registros de métricas y predicciones.

**Qué faltaba**
- Orden técnico unificado entre proyectos.
- Contratos homogéneos entre componentes.
- Patrón reusable de productivización.
- Lifecycle gobernado de forma consistente entre train, inferencia y promoción.

**Visuales sugeridos**
- (incluir aquí una comparativa “base existente” vs “gap a resolver”)

---

# 3. Objetivos y competencias
## Objetivo general y objetivos específicos

**Objetivo general**
Diseñar, implementar y validar una solución MLOps sobre Azure Machine Learning que permita modularizar, parametrizar y operativizar modelos financieros existentes, mejorando la trazabilidad, reproducibilidad y mantenibilidad del ciclo de vida.

**Objetivos específicos**
- **OE1**: Operativizar Chronos Engine end-to-end.
- **OE2**: Extraer un estándar reutilizable mediante plantilla MLOps.
- **OE3**: Validar la transferibilidad del estándar en Asset Allocation.
- **OE4**: Medir el impacto operativo del estándar.
- **OE5**: Migrar utilidades y despliegues a Azure ML SDK v2.
- **OE6**: Integrar gobernanza de modelos e inferencias en Teradata.

**Visuales sugeridos**
- (incluir aquí una diapositiva con 6 tarjetas numeradas)
- (incluir aquí una flecha horizontal Chronos -> Template -> Asset -> Gobernanza)

---

# 3. Objetivos y competencias
## Competencias seleccionadas

**Mensaje clave**
Los objetivos se conectan con competencias técnicas y transversales verificables en el desarrollo del proyecto.

**Tabla sugerida**
| Competencia | Qué demuestra en el TFM |
|---|---|
| M2N104 | Diseño de flujos de datos reproducibles y análisis avanzado adaptado al dominio financiero. |
| M2N110 | Arquitectura escalable, flexible y resistente para productivización en entornos regulados. |
| M2N111 | Automatización de pruebas, cambios, despliegues y actualizaciones mediante CI/CD y pipelines AML. |
| CTFM01 | Documentación, redacción y defensa clara del trabajo. |
| CTFM02 | Integración en entorno profesional, autonomía y coordinación con negocio/plataforma. |
| CTFM03 | Consideración de implicaciones sociales, operativas, regulatorias y económicas. |

**Visuales sugeridos**
- (incluir aquí una tabla limpia o matriz 2x3)

---

# 4. Planificación
## Cronograma del proyecto

**Mensaje clave**
La planificación se estructuró en tres fases incrementales alineadas con la narrativa del TFM.

**Fases**
1. **Fase 1 – Chronos**: operativización del primer caso real end-to-end.
2. **Fase 2 – Template**: extracción del estándar reusable.
3. **Fase 3 – Asset Allocation**: validación de la transferibilidad.

**Mensaje final**
El orden no es casual: primero se resuelve un caso productivo, después se formaliza el estándar y, por último, se valida su reutilización.

**Visuales sugeridos**
- (incluir aquí la figura del cronograma del proyecto)
- (incluir aquí imagen de la planificación)

---

# 4. Planificación
## Trazabilidad entre fases, objetivos y entregables

**Tabla sugerida**
| Fase | Objetivos | Entregables | Evidencia |
|---|---|---|---|
| Chronos | OE1, OE5 | Pipelines E2E, componentes, reporting, SDK v2 | Diagramas de pipeline y reporting |
| Template | OE2, OE6 | Plantilla reusable, contratos, lifecycle en Teradata | Tablas de capas, registry y self-promotion |
| Asset Allocation | OE3, OE4 | Despliegue transferido y comparativa de esfuerzo | Pipeline paralelo y tabla comparativa |

**Visuales sugeridos**
- (incluir aquí tabla visual con colores por fase)

---

# 5. Principios MLOps
## Marco conceptual aplicado

**Mensaje clave**
MLOps no se plantea solo como un conjunto de herramientas, sino como una forma disciplinada de operar modelos con control en producción.

**Principios base**
- Reproducibilidad
- Trazabilidad
- Monitorización
- Seguridad
- Mantenibilidad
- Control de cambios

**Definición breve para exponer**
MLOps integra machine learning, DevOps e ingeniería de datos para pasar de experimentación aislada a operación fiable en producción.

**Visuales sugeridos**
- (incluir aquí la figura de intersección MLOps: ML + DevOps + Data Engineering)
- (incluir aquí un workflow genérico de ciclo MLOps)

---

# 5. Principios MLOps
## Stack de herramientas

**Capas del stack**
- **Azure Repos / Azure DevOps**: control de cambios, repositorios, CI/CD y promoción por entornos.
- **Azure Machine Learning**: environments, components, compute, pipelines y datastores.
- **MLflow**: tracking, registry, métricas, artefactos y versiones.
- **Teradata**: gobierno corporativo de modelos e inferencias.
- **Key Vault / identidades**: gestión segura de credenciales.

**Mensaje clave**
Las herramientas importan menos por sí mismas que por el papel que cumplen dentro del lifecycle.

**Visuales sugeridos**
- (incluir aquí un diagrama por capas del stack)
- (incluir aquí logos o iconos de Azure DevOps, AML, MLflow y Teradata)

---

# 5. Principios MLOps
## Flujo MLOps y buenas prácticas

**Flujo a mostrar**
DevOps -> Azure ML -> MLflow -> Teradata -> Reporting / consumo de negocio

**Buenas prácticas principales**
- Separar lógica de negocio y plataforma.
- Modularizar y parametrizar el código.
- Definir contratos explícitos de entradas y salidas.
- Registrar métricas, artefactos y evidencias de ejecución.
- Automatizar pruebas y despliegues con control de cambios.

**Visuales sugeridos**
- (incluir aquí un diagrama del flujo MLOps extremo a extremo)
- (incluir aquí una lista visual de buenas prácticas)

---

# 6. Proceso del TFM
## Narrativa de las tres piezas

**Mensaje clave**
El TFM debe entenderse como un proceso encadenado, no como tres bloques aislados.

**Estructura en 3 cajas**
1. **Chronos Engine** -> primer caso real y complejo de productivización.
2. **TYM.MLOpsTemplate** -> extracción del estándar reusable a partir del aprendizaje anterior.
3. **Asset Allocation** -> validación de que el estándar es transferible a otro caso de negocio.

**Frase de apoyo**
Primero se demuestra que el enfoque funciona; después se formaliza; por último se valida que sirve más allá del primer caso.

**Visuales sugeridos**
- (incluir aquí una diapositiva con 3 cajitas conectadas)
- (usar flechas con etiquetas “resolver”, “estandarizar”, “transferir”)

---

# 7. Caso principal: operativización de Chronos Engine
## Qué es Chronos Engine y por qué productivizarlo

**Mensaje clave**
Chronos Engine es el caso principal del TFM y sirve como proyecto de referencia para validar el enfoque MLOps en un entorno bancario real.

**Objetivo del modelo**
- Analiza índices de Renta Fija Privada.
- Evalúa si están caros o baratos respecto a la predicción del modelo.
- Se utiliza en horizontes diario, mensual y trimestral.

**Por qué productivizarlo**
- Laboral Kutxa necesita inferencias periódicas.
- Caso complejo: 12 sectores, reporting recurrente e integración corporativa.

**Visuales sugeridos**
- (incluir aquí imagen de renta fija / bonos / spreads)
- (incluir aquí una visualización segmentada de 12 sectores)

---

# 7. Caso principal: operativización de Chronos Engine
## Arquitectura funcional del caso

**Mensaje clave**
Chronos no se resolvió como un gran script, sino como una composición de piezas desacopladas y trazables.

**Bloques a mostrar**
- Ingesta SQL / Teradata
- Preprocesado
- Entrenamiento Fair Value / Mid Term
- Registro del modelo
- Inferencia diaria
- Backtesting
- Reporting PDF / SumUp

**Visuales sugeridos**
- (incluir aquí un diagrama modular del pipeline)
- (incluir aquí una tabla ligera de contratos de datos)

---

# 7. Caso principal: operativización de Chronos Engine
## Pipeline de entrenamiento por sector

**Elementos a explicar**
- Carga de datos
- Preprocesado
- Entrenamiento por ventana/sector
- Registro del modelo
- Self-promotion

**Mensaje clave**
El entrenamiento queda registrado con métricas, hiperparámetros, artefactos y contexto de ejecución.

**Visuales sugeridos**
- (incluir aquí la figura del pipeline de entrenamiento de Chronos Engine)

---

# 7. Caso principal: operativización de Chronos Engine
## Pipeline de inferencia + backtest + report

**Elementos a explicar**
- Carga de datos
- Preprocesado
- Inferencia diaria
- Registro de inferencias
- Reconstrucción histórica / backtesting
- Generación del reporte

**Mensaje clave**
La salida de negocio forma parte del lifecycle gobernado, no es un paso accesorio.

**Visuales sugeridos**
- (incluir aquí la figura del pipeline de predicción diaria)
- (incluir aquí una miniatura del reporte operativo)

---

# 7. Caso principal: operativización de Chronos Engine
## SumUp global y evidencia de reporting

**Mensaje clave**
Con 12 sectores, el valor operativo no está en 12 salidas aisladas, sino en una consolidación útil para negocio.

**Contenido**
- Pipeline SumUp global.
- Carga de inferencias desde Teradata.
- Generación del reporte consolidado.
- Top Movers y visión unificada para Tesorería.

**Visuales sugeridos**
- (incluir aquí la figura de carga de inferencias desde Teradata y generación del reporte SumUp)
- (enseñar report SumUp)

---

# 8. Estandarización del despliegue con TYM.MLOpsTemplate
## Por qué crear una plantilla reusable

**Mensaje clave**
Tras Chronos, el siguiente objetivo fue evitar que cada nuevo modelo requiriera un arranque técnico desde cero.

**Qué persigue la plantilla**
- Homogeneizar repositorio y recursos AML.
- Estandarizar CI/CD.
- Fijar contratos de componentes.
- Integrar lifecycle entre MLflow y Teradata.

**Frase potente para la defensa**
La plantilla convierte una solución puntual en una base reusable para futuros proyectos.

**Visuales sugeridos**
- (incluir aquí un esquema “de caso puntual a estándar reusable”)

---

# 8. Estandarización del despliegue con TYM.MLOpsTemplate
## Qué resuelve y qué no resuelve

**Tabla sugerida**
| Sí resuelve | No resuelve |
|---|---|
| Estructura base de repositorio y contratos | La lógica de negocio del modelo |
| Despliegue homogéneo por entornos y CI/CD | Las features, algoritmos y reglas concretas |
| Registro y gobernanza del lifecycle con MLflow + Teradata | Los KPIs funcionales del caso de uso |

**Mensaje clave**
La plantilla acelera el arranque técnico, pero no sustituye el diseño del modelo ni las decisiones del negocio.

**Visuales sugeridos**
- (incluir aquí una tabla sí/no visual)

---

# 8. Estandarización del despliegue con TYM.MLOpsTemplate
## Estructura técnica de la plantilla

**Capas a mostrar**
- DevOps / CI-CD
- Recursos AML declarativos
- Glue layer / adaptadores
- Core logic
- Contratos template

**Mensaje clave**
La arquitectura está organizada para separar lo que cambia mucho de lo que debe mantenerse estable.

**Visuales sugeridos**
- (incluir aquí la figura de relación entre capas funcionales de la plantilla y su despliegue operativo)
- (incluir aquí una foto del repo con explicación por carpeta)

---

# 8. Estandarización del despliegue con TYM.MLOpsTemplate
## Pipelines, componentes y CI/CD

**Pipelines principales**
- Entrenamiento
- Inferencia
- Backtest

**Componentes base**
- Ingesta
- Preprocess
- Train
- Infer
- Backtest
- Registry
- Selfpromotion
- Manual fallback
- Register inference
- Report

**Mensaje clave**
La plantilla concentra una columna vertebral común que luego se adapta por configuración.

**Visuales sugeridos**
- (incluir aquí una tabla visual de pipelines y componentes)
- (incluir aquí una pipeline visual de CI/CD)

---

# 9. Transferabilidad del estándar con Asset Allocation
## Por qué usar un segundo caso

**Mensaje clave**
No bastaba con demostrar que el enfoque funcionaba en Chronos. Había que comprobar si el estándar era transferible a otro problema de negocio.

**Objetivo del modelo**
- Asset Allocation propone un balanceo de cartera con más o menos riesgo según el perfil.
- Sirve como caso de inferencias reales y validación del estándar reusable.

**Qué demuestra**
- Reutilización de estructura, CI/CD y contratos.
- Mismo mecanismo de trazabilidad y gobierno.
- Adaptación principalmente en lógica financiera y configuración.

**Visuales sugeridos**
- (incluir aquí una flecha de transferencia Chronos -> Template -> Asset Allocation)

---

# 9. Transferabilidad del estándar con Asset Allocation
## Pipeline de entrenamiento e inferencia

**Mensaje clave**
La arquitectura reusable soporta varios perfiles de riesgo sin rediseñar la infraestructura base.

**Contenido**
- Limpieza común de datos.
- Nueve ramas paralelas de entrenamiento/inferencia.
- Registro independiente por perfil.
- Consolidación final del reporte.

**Visuales sugeridos**
- (incluir aquí la figura del pipeline de entrenamiento con nueve perfiles)
- (incluir aquí la figura de inferencia paralela y consolidación final)

---

# 9. Transferabilidad del estándar con Asset Allocation
## Configuración, contrato y reporte

**Mensaje clave**
En Asset Allocation, los cambios relevantes se expresan sobre todo en configuración, no en la columna vertebral de plataforma.

**Puntos a mostrar**
- Contrato YAML versionado.
- Parámetros clave: lookback_days, rebalance_freq, risk_free_rate, constraints_group.
- Reporte consolidado como salida de negocio.

**Visuales sugeridos**
- (incluir aquí imagen del report o tabla final generada)
- (incluir aquí una tabla visual de parámetros clave)

---

# 10. Gobernanza y Trazabilidad en Teradata
## Por qué Teradata es clave

**Mensaje clave**
La computación ocurre en Azure, pero la fuente corporativa de verdad sobre el estado operativo del modelo reside en Teradata.

**Qué se gobierna**
- SolutionId
- model_id
- version
- promoción / fallback
- inferencias registradas
- evidencia de ejecución

**Visuales sugeridos**
- (incluir aquí un diagrama AML / MLflow <-> Teradata)

---

# 10. Gobernanza y Trazabilidad en Teradata
## Wrappers en MLflow y unwrapping para inferencia

**Mensaje clave**
Los wrappers pyfunc unifican la interfaz operacional del modelo y permiten desacoplar registro, recuperación e inferencia.

**Contenido**
- Wrappers para conservar preprocesador, hiperparámetros y modelo.
- Unwrapping en inferencia para cargar la versión correcta.
- Portabilidad entre train e infer sin lógica duplicada.

**Visuales sugeridos**
- (incluir aquí un esquema wrapper -> registry -> load for inference)

---

# 10. Gobernanza y Trazabilidad en Teradata
## MLOpsLifeCycle: registro, promoción e inferencias

**Flujo a mostrar**
1. Entrenamiento produce artefactos.
2. Registry registra modelo y metadatos.
3. Selfpromotion compara champion vs challenger.
4. Manual fallback permite volver a versión estable.
5. Register inference deja huella de la salida operativa.

**Mensaje clave**
Un pipeline funcional pasa a ser un proceso gobernado cuando existen reglas explícitas de promoción, evidencia y recuperación.

**Visuales sugeridos**
- (incluir aquí las figuras de registry, self-promotion y register inference)
- (incluir aquí flujo champion/challenger/fallback)

---

# 10. Gobernanza y Trazabilidad en Teradata
## Solution ids, model_ids y trazabilidad extremo a extremo

**Mensaje clave**
La jerarquía solution_id -> model_id -> version permite responder sin ambigüedad qué solución se ejecutó, qué modelo produjo la salida y qué versión estaba vigente.

**Puntos a destacar**
- Persistencia en procedimientos corporativos.
- Evidencia técnica en MLflow + evidencia operativa en Teradata.
- Base para auditoría, recuperación y control corporativo.

**Visuales sugeridos**
- (incluir aquí una tabla-resumen de identificadores y propósito)

---

# 11. Resultados obtenidos
## Resultados estructurales del trabajo

**Cifras clave**
- **Chronos Engine**: 44 pipelines y 25 componentes AML.
- **TYM.MLOpsTemplate**: 3 pipelines y 11 componentes base.
- **Asset Allocation**: 2 pipelines y 11 componentes para 9 perfiles.

**Interpretación correcta**
Estas cifras no deben leerse como inventario técnico, sino como evidencia de capacidad operativa, reutilización y control del ciclo de vida.

**Visuales sugeridos**
- (incluir aquí una gráfica de barras comparativa)

---

# 11. Resultados obtenidos
## Cumplimiento de objetivos y competencias

**Resumen por objetivo**
- **OE1** cumplido: Chronos operativizado end-to-end.
- **OE2** cumplido: plantilla reusable y CI/CD homogéneo.
- **OE3** cumplido con limitación: transferencia validada en Asset Allocation.
- **OE4** cumplido: comparativa explícita del esfuerzo operativo.
- **OE5** cumplido: adopción de Azure ML SDK v2.
- **OE6** cumplido: gobernanza de lifecycle en Teradata.

**Mensaje clave**
Los resultados no son solo técnicos; también evidencian competencias de arquitectura, automatización, documentación, integración y gobierno.

**Visuales sugeridos**
- (incluir aquí una matriz de objetivos con checks)
- (incluir aquí una tabla o scorecard de competencias)

---

# 11. Resultados obtenidos
## Resultados tangibles

**Resultados tangibles**
- 2 modelos productivizados en casos reales.
- Plantilla reusable preparada como estándar de despliegue.
- Trazabilidad y auditoría del ciclo de vida con MLflow + Teradata.
- Reducción de tiempos de arranque gracias a reutilización y CI/CD homogéneo.
- Reducción de errores de integración por contratos YAML.
- Documentación operativa: README.md, USER-GUIDE.md y AZURE-DOCS.md.

**Mensaje clave**
El trabajo deja activos reutilizables, no solo evidencias académicas.

**Visuales sugeridos**
- (incluir aquí una slide de entregables tangibles con iconos)

---

# 12. Marco Legislativo
## Normativa y marcos de referencia

**Mensaje clave**
En este proyecto no basta con que el pipeline funcione; también debe estar alineado con protección de datos, seguridad, gobierno del modelo y capacidad de auditoría.

**Tabla sugerida**
| Norma / Marco | Enfoque en el proyecto |
|---|---|
| RGPD — Reglamento (UE) 2016/679 | Minimización, trazabilidad del tratamiento, control de accesos y custodia de secretos. |
| LOPDGDD — Ley Orgánica 3/2018 | Aterrizaje nacional del cumplimiento en protección de datos. |
| AI Act / AIA — Reglamento (UE) 2024/1689 | Gobierno, trazabilidad y supervisión humana de sistemas de IA. |
| SR 11-7 (MRM) | Gestión de riesgo de modelo, criterios explícitos de promoción y fallback. |
| NIST AI RMF 1.0 | Gobernar, mapear, medir y gestionar riesgos de IA. |

**Visuales sugeridos**
- (incluir aquí una tabla legislativa limpia con una frase por marco)

---

# 12. Marco Legislativo
## Cómo se aterriza técnicamente el cumplimiento

**Contenido a destacar**
- Identidades y variables seguras.
- Segregación por entornos.
- Registro verificable de versiones y decisiones.
- Trazabilidad de ejecución enlazando modelo, artefactos e inferencias.
- Plan de contingencia y controles preventivos/detectivos.

**Mensaje clave**
El cumplimiento no se trata como documentación externa al sistema, sino como parte del propio diseño técnico.

**Visuales sugeridos**
- (incluir aquí una slide con 4-5 iconos de compliance, audit trail, security y governance)

---

# 13. Memoria económica y viabilidad del proyecto
## Costes directos observados

**Mensaje clave**
La memoria económica se apoya en costes directos observados, evitando estimaciones especulativas.

**Contenido**
- Coste cloud del workspace: **1.349,92 EUR**
- Almacenamiento / Datastore imputado: **500,00 EUR**
- Coste de dedicación del estudiante (6,5 meses): **8.977,80 EUR**
- **Total directo imputado: 10.827,72 EUR**

**Visuales sugeridos**
- (incluir aquí las 2 fotos de la memoria económica: Azure Cost Analysis)
- (incluir aquí una tabla resumen de costes)

---

# 13. Memoria económica y viabilidad del proyecto
## Viabilidad y ROI

**Mensaje clave**
La viabilidad se valora desde una perspectiva operativa: la inversión habilita una operación gobernada y reproducible; el ROI monetario cerrado aún no se cuantifica por falta de histórico financiero consolidado.

**Qué decir**
- Sí existe coste directo trazable.
- Sí existe evidencia de valor operativo: menos esfuerzo incremental, más control y más reutilización.
- No se presenta un ROI económico cerrado porque todavía no hay serie histórica suficiente para aislar beneficios monetarios atribuibles.

**Frase útil para la defensa**
Más que un ROI financiero cerrado, la memoria aporta una base fiable para medirlo más adelante con evidencia comparable.

**Visuales sugeridos**
- (incluir aquí una slide con “Coste directo trazable” vs “ROI monetario pendiente de consolidación”)

---

# 14. Conclusiones
## Cumplimiento de objetivos y competencias

**Conclusiones principales**
- Se cumple el objetivo general de diseñar, implementar y validar una solución MLOps sobre AML.
- Se cumplen los 6 objetivos específicos con distinto nivel de evidencia y una limitación principal: la transferibilidad se valida en un segundo caso, no en una cartera amplia de modelos.
- Se consolidan las 6 competencias seleccionadas, tanto técnicas como transversales.

**Visuales sugeridos**
- (incluir aquí una diapositiva de cierre con checks de objetivo general + 6 OE + 6 competencias)

---

# 14. Conclusiones
## Lectura cuantitativa del impacto

**Tiempo estimado de productivización**
- **Chronos Engine**: ~4 meses
- **Asset Allocation**: ~3 semanas

**Mensaje clave**
Las plantillas suponen una mejora aproximada del **75%** en el esfuerzo/tiempo de arranque de nuevos proyectos, aunque esta cifra debe interpretarse como evidencia operativa relativa y no como causalidad estricta.

**Matiz importante**
- Influyen también aprendizaje acumulado, disponibilidad de datos y permisos.
- Aun así, la diferencia observada justifica claramente el valor del estándar.

**Visuales sugeridos**
- (incluir aquí una gran cifra central “~75%”)
- (incluir aquí una barra comparativa muy clara)

---

# 14. Conclusiones
## Cierre conceptual

**Mensaje fuerte para cerrar**
La aportación del TFM no es un nuevo modelo financiero, sino una forma más madura de llevar modelos financieros a producción con control, evidencia y continuidad operativa.

**Ideas de cierre**
- De la ejecución manual a la operación gobernada.
- De un caso puntual a una base reusable.
- De la nube como infraestructura a la nube como entorno de gobernanza.

**Visuales sugeridos**
- (incluir aquí una diapositiva final con 3 ideas de cierre y un diagrama final)

---

# 15. Líneas futuras
## Evolución técnica y organizativa

**Líneas futuras propuestas**
- Unit Tests y pruebas de integración más completas.
- Mejorar AutoPromoción para las necesidades de TyM.
- Productivizar nuevos modelos mediante las plantillas.
- Gobernanza formal de las plantillas.
- Monitorización y cuadros de mando.
- Automatizar la entrega segura y trazable de los reportes operativos a los equipos de negocio mediante un canal corporativo validado por cumplimiento.
- Mejorar los datos de Teradata.

**Forma de explicarlo**
Las líneas futuras se centran en madurez, escalado y gobierno: más pruebas, más modelos, mejor monitorización, mejor circuito de reporting y una formalización mayor del estándar.

**Visuales sugeridos**
- (incluir aquí un roadmap futuro a corto, medio y largo plazo)

---

# Cierre

<section class="premium-meteor-slide" data-transition="convex">
<div class="meteor-canvas" aria-hidden="true">
<span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span>
<span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span><span class="meteor"></span>
</div>
<div class="slide-pad closing">
<h2>Muchas gracias</h2>
<p class="subtitle">En finanzas, el valor de un modelo depende de su capacidad de operar con control, evidencia y continuidad.</p>
<p class="footer-line">Unai Elorriaga Aramburu | Laboral Kutxa | 2025-2026</p>
<div class="closing-logos">
    <img class="no-hover-zoom" src="./assets/images/Laboral_Kutxa.png" alt="Logo Laboral Kutxa" />
    <img class="no-hover-zoom" src="./assets/images/Mondragon.png" alt="Logo Mondragon Unibertsitatea" />
</div>
</div>
</section>
