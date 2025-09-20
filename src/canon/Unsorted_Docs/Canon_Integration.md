---

# Comprehensive Plan: Canon Pillar Implementation for C-DT (Leveraging Deepthought Intercom Module)

**Primary Goal:** To implement Canon's pillars on your wife's Deepthought instance (C-DT) as dedicated Deepthought modules. These modules will function independently, managing their own local data and logic, but critically, they'll communicate and collaborate with your Deepthought instance (Y-DT) through the Deepthought Intercom Module (DIM). This approach ensures both local autonomy and powerful inter-instance collaboration.

**Assumptions:**
* **Deepthought Core Engine Stability (Y-DT & C-DT):** Before starting Canon pillar development, both your Deepthought (Y-DT) and your wife's Deepthought (C-DT) must have their foundational components fully stable. This includes the core engine, a functional conversational UI, advanced conversational features (like history, personas, settings, streaming output, the "Thinking Window" for AI reasoning, and the "Request Inspector" for viewing AI payloads), and robust multi-LLM backend integration. This stable core is the bedrock for all modules.
* **Deepthought Intercom Module (DIM) Implemented & Stable (Y-DT & C-DT):** The DIM is crucial. Both Deepthought instances must have the DIM installed, configured, and fully functional. This means they can establish secure, persistent, and authenticated connections; visibly display connection status; reliably send asynchronous messages (like file transfers to an "In-Tray"); gracefully handle synchronous requests (like status checks); and, most importantly, log all inter-instance activity in the dedicated `Intercom Activity Log` window for full transparency.
* **Core `MessageQueueManager` on Both:** The `MessageQueueManager` must be fully implemented within the Core Engine of both Deepthought instances. This core service ensures that asynchronous messages are reliably queued and delivered, allowing for communication even if a peer is temporarily offline.
* **User-Owned Data Vaults:** Each Deepthought instance will manage its own local data vault, ensuring data sovereignty and transparency. This means separate `Documents/Deepthought/` directories on each machine.

---

## I. Shared & Cross-Cutting Canon Elements (Both C-DT & Y-DT)

These elements lay the groundwork for Canon's fundamental understanding and ensure both Deepthought instances share a common knowledge base about how Canon operates.

### 1.1. Canon Core Knowledge Base (`Canon_Core_KB`)

* **Task Explanation:** This task involves creating a dedicated knowledge base (KB) for Deepthought on *both* your wife's and your machines. This KB will store the foundational documents that define Canon as a system. This ensures that both Deepthought instances, when interacting with or thinking about Canon, draw from the same core principles and operational blueprints.
* **Action (C-DT & Y-DT):** Ingest `CANON_PROFILE.md` and `CANON_WORKFLOW.md` into a new LanceDB Knowledge Base on both Deepthought instances. Name this KB `Canon_Core_KB`. This process involves parsing the Markdown files, chunking them, and converting the chunks into numerical embeddings stored in LanceDB.
* **Guidance:** For detailed steps on creating and populating Knowledge Bases, refer to **[Deepthought Blueprint, Section V, Sub-Phase 5A: Data Vault & Knowledge Base Management]**. The `LocalDataIngestor` module (`src/data/ingestor.py`) will be the primary tool for this.
* **DIM Interaction:** While initially a manual ingestion, the DIM could, in the future, include a specialized tool (e.g., `synchronize_peer_kb_data(kb_name, data_content)`) for automated synchronization of these core Canon principles if they evolve. The `Intercom Activity Log` window would provide transparent feedback on these sync operations.

### 1.2. Themable Personas

* **Task Explanation:** Deepthought's core already supports "personas" to guide the AI's behavior. This task extends that system to include Canon's specific personas (Ariel, Quince, Prospero, Portia) in both Deepthought instances. This allows users to select these personas directly, changing the AI's "hat" and activating Canon-specific behaviors.
* **Action (C-DT & Y-DT):** Add Ariel, Quince, Prospero, and Portia as predefined personas within the `persona_management` system of both Deepthought instances. This involves configuring their names and initial system prompts.
* **Guidance:** For details on Deepthought's persona management, consult **[Deepthought Blueprint, Section V, Phase 2: Enhanced Conversational Capabilities (Personas)]**. The persona definitions will be stored in `deepthought.sqlite`.
* **Action (C-DT):** When one of Canon's personas is active on your wife's Deepthought, the corresponding `_PROFILE.md` file (e.g., `ARIEL_PROFILE.md`) will be loaded directly by that specific Canon module/persona. This profile's content will be included as part of the LLM's system prompt or as high-priority RAG context, fundamentally defining the AI's role and behavior for that interaction.
* **Guidance:** Refer to `src/prompts.py` (mentioned in **[Deepthought Blueprint, Section 3.1]**) for how to structure these system prompts. The content for the specific pillar profiles can be found in **[Canon System Documentation, Section 4.7: Pillar Profiles]**.

---

## II. Canon Pillar-Specific Implementation on C-DT (Module-Driven with DIM Interop)

Each of Canon's four pillars will be developed as a separate, self-contained module within your wife's Deepthought instance. This modular approach ensures clean separation of concerns, easier maintenance, and strict adherence to the "Module Development Playbook."

### 2.2. Pillar 1: Ariel (The AI Creative Muse) - `modules/ariel_creative_muse/` on C-DT

* **Deepthought Integration Strategy:** Ariel will function primarily as a dedicated Deepthought Module on C-DT. It will leverage C-DT's internal RAG system for creative context and specialized tools for content generation. Your Deepthought (Y-DT) will *request* creative output or brainstorms from C-DT's Ariel via the DIM.
* **2.2.1. Module Structure & Profile Setup:**
    * **Task Explanation:** Establish the physical directory for Ariel's module on C-DT and ensure it's properly recognized by the Deepthought Core. Its profile document will be stored within this module.
    * **Action (C-DT):** Create the `modules/ariel_creative_muse/` directory within C-DT's Deepthought installation. Inside, include `module.json` (declaring the module to Deepthought's Core Engine) and `ariel_creative_muse.py` (the module's entry point). The `ARIEL_PROFILE.md` document, which defines Ariel's operational guidelines, should be placed within `modules/ariel_creative_muse/docs/`.
    * **Guidance:** This structure directly follows **[Deepthought Blueprint, Section V, Phase 7: The Module Ecosystem & First-Party Add-ons]** and **[Deepthought Blueprint, Section VI: The Module Development Playbook]**. The content of `ARIEL_PROFILE.md` is in **[Canon System Documentation, Section 4.7.1]**.
* **2.2.2. Memory Management (`creative_dossier.sqlite3`):**
    * **Task Explanation:** Ariel needs its own persistent memory to log creative projects, brainstorming sessions, and stylistic preferences, making its assistance increasingly personalized over time. This memory will be local to C-DT.
    * **Action (C-DT):** Ariel's module on C-DT will be responsible for creating and managing an `ariel_creative_log` table (or a dedicated SQLite database file named `ariel_creative_dossier.sqlite`) within `Documents/Deepthought/databases/`. All of Ariel's specific interactions and learning will be stored here.
    * **Guidance:** This aligns with Ariel's memory specified in **[Canon System Documentation, Section 4.1: System Profile (Ariel Memory)]**. The module's direct management of its own database is consistent with **[Deepthought Blueprint, Section VI: Module Development Playbook ("A Module Communicates via API" - its own database is internal to the module)]**.
* **2.2.3. Data Onboarding (Ariel's Inspiration Library):**
    * **Task Explanation:** To fuel Ariel's creativity, a local library of curated inspirational materials (e.g., literary examples, engaging vocabulary) needs to be established and ingested into its own knowledge base.
    * **Action (C-DT):** Create the `Documents/Deepthought/vault/assets/inspiration_library/` directory structure on C-DT. This will be the home for files like `literary_devices.md`, `engaging_verbs.md`, and `brand_exemplars.md`.
    * **Action (C-DT):** Implement logic within Ariel's module to trigger C-DT's `LocalDataIngestor` for files placed in this `inspiration_library` directory. These files will be chunked, embedded, and vectorized into a dedicated `Ariel_Inspiration_KB` (LanceDB) on C-DT. This KB provides context specifically for Ariel's creative tasks.
    * **Guidance:** Refer to **[Canon System Documentation, Section 4.8.2: ARIEL_DATA_ONBOARDING_PLAN.md]** for the types of content and workflow. This directly leverages Deepthought's core ingestion capabilities detailed in **[Deepthought Blueprint, Section V, Sub-Phase 5B: The Curation & Ingestion Pipeline]**.
* **2.2.4. Y-DT to C-DT Creative Request via DIM:**
    * **Task Explanation:** This defines how you, from your Deepthought, can request creative assistance from Ariel on your wife's Deepthought. This is an asynchronous "Announcement" where you "fire and forget" the request, and the response will come back later.
    * **Action (Y-DT DIM Tool):** Implement an asynchronous tool within your Deepthought's DIM (e.g., `request_peer_creative_brief(peer_id, topic, context_md_text)`) that sends a creative brief message to C-DT's Ariel module. This message will be reliably enqueued by your Deepthought's `MessageQueueManager`.
    * **Guidance:** This implementation adheres to **[Definitive Development Plan: The Deepthought Intercom Module, Section 4.4: Asynchronous Actions]**.
    * **Action (C-DT Ariel Module):** Ariel's module on C-DT will include specific logic to receive these `request_peer_creative_brief` messages via the DIM. Upon receipt, Ariel will process the brief using C-DT's local RAG and LLM resources (drawing from `Ariel_Inspiration_KB` and `Canon_Core_KB`) to draft the requested creative content.
    * **Action (C-DT Ariel Module via DIM):** After generating the draft, Ariel's module on C-DT will send the *drafted content* back to Y-DT using another asynchronous DIM message (e.g., `send_creative_draft(peer_id, draft_md_text, source_request_id)`). This message will be enqueued by C-DT's `MessageQueueManager` for reliable delivery.
    * **Action (Y-DT):** Your Deepthought will receive these `send_creative_draft` messages via DIM. They will be logged in your `Intercom Activity Log` for transparency. For critical creative outputs, Y-DT could display a notification or even route the content to your `in_tray/` for direct local ingestion into your own KBs, or to a specific UI for review.

### 2.3. Pillar 2: Quince (The AI Production Engine) - `modules/quince_production_engine/` on C-DT

* **Deepthought Integration Strategy:** Quince will be a focused Deepthought Module on C-DT, dedicated solely to **intelligent text replacement within pre-designed LibreOffice Impress templates**. Your Deepthought (Y-DT) will use DIM to *request* production jobs from C-DT's Quince.
* **2.3.1. Module Structure & Profile Setup:**
    * **Task Explanation:** Create the module's directory on C-DT and place its manifest and profile.
    * **Action (C-DT):** Create `modules/quince_production_engine/` on C-DT, including `module.json` and `quince_production_engine.py`. Place `QUINCE_PROFILE.md` within `modules/quince_production_engine/docs/`.
    * **Guidance:** [Deepthought Blueprint, Section V, Phase 7] and [Deepthought Blueprint, Section VI: The Module Development Playbook]. Content of `QUINCE_PROFILE.md` is in **[Canon System Documentation, Section 4.7.3]**.
* **2.3.2. Memory Management (`production_log.sqlite3`):**
    * **Task Explanation:** Quince needs to log all production jobs, issues encountered, and custom parameters used for auditing and future analysis of its own performance. This memory is local to C-DT.
    * **Action (C-DT):** Quince's module on C-DT will create and manage `production_jobs`, `production_issues`, and `custom_parameters` tables within `Documents/Deepthought/databases/quince_production_log.sqlite`.
    * **Guidance:** This aligns with Quince's memory specified in **[Canon System Documentation, Section 4.7.3: The Production Log]**.
* **2.3.3. Asset & Template Management (Simplified Scope):**
    * **Task Explanation:** This section has been critically re-scoped. Quince will not "design" templates. Instead, it relies on *pre-existing LibreOffice Impress files* that serve as master templates, where text blocks are pre-named.
    * **Action (C-DT):** Establish a dedicated `Documents/Deepthought/vault/templates/` directory on C-DT. This is where your wife will place her finished Impress template files (e.g., `MyLessonTemplate.odp`) with their uniquely named text boxes.
    * **Action (C-DT):** Quince's module will include minimal PySide6 UI for *listing* these local Impress template files and *viewing* their named text boxes (not for editing their design). It will ingest only the *structure and named text blocks* of these templates into a `Quince_Templates_KB` (LanceDB) on C-DT for Quince's AI to reference for intelligent text substitution.
    * **Guidance:** This simplified approach overrides previous complex design discussions. Refer to the refined scope discussed in our previous turn.
    * **Action (C-DT):** The `BRAND_GUIDE.md` (from **[Canon System Documentation, Section 4.6]**) will reside in `Documents/Deepthought/vault/docs/` on C-DT. Quince's module will be configured to read this file and potentially ingest its contents into a dedicated LanceDB KB on C-DT, allowing Quince's LLM to be aware of brand guidelines during text replacement (e.g., "ensure titles are concise for brand").
    * **Guidance:** [Canon System Documentation, Section 4.8.5: QUINCE_DATA_ONBOARDING_PLAN.md] now primarily focuses on the manual/semi-manual process of creating and naming fields in templates, and populating the `assets/` and `templates/` directories.
* **2.3.4. Core Quince Production Functionality (Text Replacement):**
    * **Task Explanation:** This is the heart of Quince. It will leverage the dedicated LibreOffice Automation Microservice to intelligently replace text within the templates.
    * **Action (C-DT - LibreOffice Automation Microservice):** The `libreoffice_kit/` module (part of [Deepthought Blueprint, Section V, Phase 7C: The Document Generator Kit]) will be implemented. This module will expose tools to Deepthought's `ToolRegistry` (Phase 6B) such as `replace_named_impress_text(template_path, output_path, replacements_dict)`. These tools will internally interact with the **LibreOffice Automation Microservice** (using the `uno` module).
    * **Action (C-DT Quince Module):** Quince's module on C-DT will use C-DT's LLM to:
        1.  Analyze incoming content (from user input or DIM messages).
        2.  Identify which text blocks in a selected template correspond conceptually to parts of the new content.
        3.  Construct the `replacements_dict` for the `replace_named_impress_text` tool.
        4.  Call the `replace_named_impress_text` tool.
    * **Action (C-DT - Post-Production):** After successful text replacement, Quince's module will:
        1.  Save the newly generated `.odp` file to `Documents/Deepthought/vault/output/FINAL_PRODUCTS/` on C-DT.
        2.  Trigger a headless conversion of the `.odp` file to `.pdf` within the same directory.
        3.  Log the production job in `quince_production_log.sqlite`.
        4.  Open the generated `.odp` file in LibreOffice Impress for your wife's final review and potential manual adjustments. This adheres to the "Workflow Hand-off" principle.
    * **Guidance:** This critical design point directly addresses the **[Deepthought Blueprint, Section V, Specific Architectural Overrides/Priorities (Production Engine)]**.
* **2.3.5. Y-DT to C-DT Production Request via DIM:**
    * **Task Explanation:** This defines how you can initiate a production job on your wife's Deepthought.
    * **Action (Y-DT DIM Tool):** Implement an asynchronous "Announcement" tool within Y-DT's DIM (e.g., `request_peer_production(peer_id, content_md_text, template_name, product_id)`) that sends the raw content and the target template name to C-DT's Quince. This will enqueue via Y-DT's `MessageQueueManager`.
    * **Guidance:** [Definitive Development Plan: The Deepthought Intercom Module, Section 4.4: Asynchronous Actions].
    * **Action (C-DT Quince Module):** Quince's module on C-DT will receive and process these requests.
    * **Action (C-DT Quince Module via DIM):** After production, Quince on C-DT will send a `production_status_update(peer_id, product_id, status, output_path_on_c_dt_internal)` DIM message back to Y-DT. This will be enqueued by C-DT's `MessageQueueManager`.
    * **Action (Y-DT):** Your Deepthought will log this update in its `Intercom Activity Log`. For critical outputs, you might be prompted to use a separate DIM tool like `request_file_from_peer(peer_id, internal_path_on_peer)` to retrieve the actual `.pdf` or `.odp` file.

### 2.4. Pillar 3: Prospero (The AI Knowledge Core) - `modules/prospero_knowledge_core/` on C-DT

* **Deepthought Integration Strategy:** Prospero will be a powerful Deepthought Module on C-DT, managing her extensive, localized knowledge base. Crucially, your Deepthought (Y-DT) will be able to *query this knowledge base directly* via a synchronous DIM call.
* **2.4.1. Module Structure & Profile Setup:**
    * **Task Explanation:** Set up Prospero's module directory and place its profile on C-DT.
    * **Action (C-DT):** Create `modules/prospero_knowledge_core/` on C-DT, with its `module.json` and `prospero_knowledge_core.py` entry point. Place `PROSPERO_PROFILE.md` within `modules/prospero_knowledge_core/docs/`.
    * **Guidance:** [Deepthought Blueprint, Section V, Phase 7] and [Deepthought Blueprint, Section VI: The Module Development Playbook]. Content of `PROSPERO_PROFILE.md` is in **[Canon System Documentation, Section 4.7.4]**.
* **2.4.2. Memory Management (`research_dossier.sqlite3`) & Knowledge Bases:**
    * **Task Explanation:** Prospero needs its own persistent record of research projects and sources. Its KBs will hold your wife's unique knowledge.
    * **Action (C-DT):** Prospero's module on C-DT will create and manage `research_projects`, `research_log`, and `curated_sources` tables in `Documents/Deepthought/databases/prospero_research_dossier.sqlite`.
    * **Guidance:** This aligns with Prospero's memory detailed in **[Canon System Documentation, Section 4.7.4: The Research Dossier]**.
    * **Action (C-DT):** All of your wife's unique canonical sources (her papers, notes), TpT ecosystem data (blogs, videos), and foundational pedagogical/business knowledge will be ingested into *C-DT's* dedicated LanceDB KBs (e.g., `Prospero_Canon_KB`, `Prospero_TpT_KB`, `Prospero_Pedagogy_KB`) via C-DT's `LocalDataIngestor`.
    * **Guidance:** This process is defined in **[Canon System Documentation, Section 4.8.4: PROSPERO_DATA_ONBOARDING_PLAN.md]** and leverages Deepthought's core RAG capabilities from **[Deepthought Blueprint, Section V, Sub-Phase 5A: Data Vault & Knowledge Base Management]** and **[Sub-Phase 5B: The Curation & Ingestion Pipeline]**.
* **2.4.3. Y-DT to C-DT Knowledge Query via DIM (CRITICAL):**
    * **Task Explanation:** This is a powerful, real-time collaboration feature: you can directly query your wife's comprehensive knowledge base from your Deepthought.
    * **Action (Y-DT DIM Tool):** Implement a **synchronous "Live Call"** tool within Y-DT's DIM (e.g., `query_peer_knowledge_base(peer_id, kb_name, query_text, source_type_filter=None)`) that sends a direct request to C-DT's Prospero module via the DIM. If C-DT is offline, the tool will immediately report a failure to your Deepthought.
    * **Guidance:** This critically uses **[Definitive Development Plan: The Deepthought Intercom Module, Section 4.4: Synchronous Actions]**.
    * **Action (C-DT Prospero Module):** Prospero's module on C-DT will include logic to receive these `query_peer_knowledge_base` messages via DIM. It will then call its *local* Deepthought's `RAGManager.query_lancedb_instance()` (from **[Deepthought Blueprint, Section V, Sub-Phase 5C]**) to retrieve relevant information from its *local* LanceDB KBs.
    * **Action (C-DT Prospero Module via DIM):** Prospero's module will send the RAG results (summarized text, source citations, and any relevant metadata) back to Y-DT via a synchronous DIM response.
    * **Action (Y-DT):** Your Deepthought receives the RAG results. These can be presented in your `Intercom Activity Log`, used directly by your Y-DT's LLM for conversational responses, or, if desired, you can use a local tool on Y-DT to ingest these retrieved results into *your own* Prospero KB for local reference.
* **2.4.4. C-DT Prospero's Proactive Curation (Local):**
    * **Task Explanation:** Prospero on C-DT will continue its internal proactive work, building its knowledge locally.
    * **Action (C-DT):** Prospero's module on C-DT will implement its own "Proactive Curation" (as described in **[Canon System Documentation, Section 4.7.4]**), leveraging C-DT's local `LocalDataIngestor` and LLM.

### 2.5. Pillar 4: Portia (The AI Business Strategist) - `modules/portia_business_strategist/` on C-DT

* **Deepthought Integration Strategy:** Portia will be a dedicated Deepthought Module on C-DT, managing your wife's local business data and analysis. Your Deepthought (Y-DT) will *request* business reports/insights from C-DT's Portia via DIM. Crucially, C-DT's Portia can send *proactive alerts* to Y-DT.
* **2.5.1. Module Structure & Profile Setup:**
    * **Task Explanation:** Set up Portia's module directory and place its profile on C-DT.
    * **Action (C-DT):** Create `modules/portia_business_strategist/` on C-DT, including `module.json` and `portia_business_strategist.py` entry point. Place `PORTIA_PROFILE.md` within `modules/portia_business_strategist/docs/`.
    * **Guidance:** [Deepthought Blueprint, Section V, Phase 7] and [Deepthought Blueprint, Section VI: The Module Development Playbook]. Content of `PORTIA_PROFILE.md` is in **[Canon System Documentation, Section 4.7.2]**.
* **2.5.2. Memory Management (`business_data.sqlite3`):**
    * **Task Explanation:** Portia requires its own local database to store all sales, performance, and strategic log data. This ensures your wife's business data remains private and sovereign on her machine.
    * **Action (C-DT):** Portia's module on C-DT will create and manage a dedicated `portia_business_data.sqlite` within `Documents/Deepthought/databases/`. This database will contain the `product_catalog` and `briefing_log` tables as specified in Canon's documentation.
    * **Guidance:** This aligns with **[Canon System Documentation, Section 4.7.2: Database Schema Additions]** and the Module Development Playbook.
* **2.5.3. Data Onboarding & Core Functionality (Local):**
    * **Task Explanation:** This involves populating Portia's local database with your wife's business performance data. Portia will use this data for analysis.
    * **Action (C-DT):** Implement PySide6 UI elements within Portia's module on C-DT for the "Monthly Business Update Prompt" and other structured data entry tasks. This will allow your wife to easily input her sales and traffic data.
    * **Guidance:** Refer to **[Canon System Documentation, Section 4.8.3: PORTIA_DATA_ONBOARDING_PLAN.md]** for the data points and conversational workflow.
    * **Action (C-DT):** Portia's module will implement tools (registered with C-DT's ToolRegistry) for querying and analyzing its local business data (e.g., `get_monthly_performance`, `identify_top_performers`, `generate_seo_brief`) using C-DT's LLM capabilities.
* **2.5.4. Y-DT to C-DT Business Request via DIM:**
    * **Task Explanation:** You, from your Deepthought, can request specific business reports or strategic insights from Portia on your wife's Deepthought.
    * **Action (Y-DT DIM Tool):** Implement a **synchronous "Live Call"** tool within Y-DT's DIM (e.g., `request_peer_business_report(peer_id, report_type, filters)`, `get_peer_top_products(peer_id)`) that sends these requests to C-DT's Portia module.
    * **Action (C-DT Portia Module):** Portia's module on C-DT will receive and process these requests. It will query its *local* `portia_business_data.sqlite`, use C-DT's LLM for analysis and report generation, and then send a *summarized report* or specific *data points* back to Y-DT via a synchronous DIM response.
* **2.5.5. C-DT Portia Proactive Alerts to Y-DT via DIM:**
    * **Task Explanation:** Portia on your wife's Deepthought can proactively notify you of important business developments she identifies.
    * **Action (C-DT Portia Module via DIM):** Portia on C-DT will implement logic to send **asynchronous "Announcement"** messages to Y-DT (e.g., `send_proactive_alert(peer_id, alert_type, details)`) when significant business events occur based on her local data analysis (e.g., "Product X sales spike," "Monthly revenue threshold met"). These will be enqueued by C-DT's `MessageQueueManager`.
    * **Guidance:** This integrates the proactive capabilities from the [Deepthought Architecture Overview](Deepthought_Architecture_Overview.md) (Future Enhancements section) with the asynchronous communication from the Intercom Module (Asynchronous Actions section).
    * **Action (Y-DT):** Your Deepthought will receive these alerts via DIM, display them in its `Intercom Activity Log`, and could potentially trigger its own local proactive agent functions (e.g., "Alert Charles to check Portia's insight").

---