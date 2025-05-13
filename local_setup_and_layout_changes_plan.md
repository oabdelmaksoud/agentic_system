# Agentic System Local Setup and Layout Changes Plan

## Introduction

This document outlines a plan to set up the Agentic System for local development and testing on the user's machine, prioritizing layout changes to the UI mockups as requested. The goal is to create a fully functioning local environment to test features before cloud deployment, aligning with the user's directive to run the project locally. This plan addresses the immediate need to update the layout structure based on user feedback provided in the review process and integrates with the broader pre-production roadmap (`pre_production_roadmap.md`) by focusing on a local setup as a precursor to cloud-based implementation.

## Objectives

- Update the UI mockups to reflect the layout changes specified by the user, restructuring pages and navigation as sub-pages where applicable.
- Establish a local development environment to run and test the Agentic System with the updated layout.
- Ensure the local setup supports iterative testing of features and simulates key functionalities outlined in the software requirements (`implementation/software_engineering/SWE.1_software_requirements_analysis/ASP_SWRS_SoftwareRequirementsSpecification_v1.0.md`).
- Provide a foundation for further development and testing before moving to cloud deployment.

## Timeline

- **Duration**: 2 weeks (immediate focus on layout changes in Week 1, local setup in Week 2)
- **Start Date**: Immediately following approval of this plan
- **End Date**: End of Week 2

## Prerequisites

- Approval of this local setup and layout changes plan.
- Access to the user's local machine with necessary permissions to install development tools (e.g., Node.js, Docker if needed).
- Availability of the current UI mockups in `Webapp Mockup/` directory for modification.
- User feedback on layout changes as provided in the review process, which will guide the restructuring of the UI.
- Basic familiarity with web development tools and environments to execute the setup instructions.

## Step-by-Step Plan

### Step 1: Layout Changes to UI Mockups (Week 1)
**Objective**: Update the UI mockups to reflect the structural and navigational changes specified by the user, ensuring the layout aligns with the intended usage and visibility restrictions.

- **Tasks**:
  1. **Restructure Navigation Hierarchy**:
     - Modify `index.html` to update the navigation grid, prioritizing Web Automation before Settings as requested.
     - Restructure Projects as the main activity page, with Agents, Documents, and Analytics as sub-pages accessible from within the Projects section. This can be simulated by updating links or creating a nested navigation structure in the HTML.
  2. **Update Page-Specific Content and Visibility**:
     - **Dashboard**: Add a note or visual indicator in `agentic_system_ui_mockup.html` stating it is a comprehensive summary of system performance with KPIs, restricted to admin users only (currently displayable, content to be revised later).
     - **Projects**: Enhance `agentic_system_projects.html` to show a list of user-assigned projects only, with a mock detailed view including a placeholder for a project documents tree (simulating API import from a configuration management tool) and a Live Agent Workspace for prompt-based actions.
     - **Agents**: Update `agentic_system_agents.html` to reflect it as a sub-page of Projects, focusing on agent activity for the selected project only. Remove "Manage Plugins" content, relocating it to Settings.
     - **Documents**: Modify `agentic_system_documents.html` to be a sub-page of Projects, focusing on project-specific document changes and activities.
     - **Analytics**: Update `agentic_system_analytics.html` to be a sub-page of Projects, focusing on project-specific data analysis with mock charts or visualizations.
     - **Web Automation**: Ensure `agentic_system_web_automation.html` is positioned before Settings in navigation across all relevant pages.
     - **Settings**: Enhance `agentic_system_settings.html` with a placeholder feature toggle interface for enabling/disabling all features and sub-features, noting it is restricted to admin users later (currently displayable). Add "Manage Plugins" content relocated from Agents.
  3. **Create Navigation Consistency**: Ensure all HTML files reflect the updated hierarchy by adding a consistent sidebar or navigation menu that shows Projects as the parent page with sub-pages (Agents, Documents, Analytics) and prioritizes Web Automation before Settings.
  4. **Document Changes**: Create a summary of layout changes made to each file for user reference, ensuring transparency in modifications.

- **Deliverables**:
  - Updated UI mockup HTML files in `Webapp Mockup/` directory reflecting the new layout structure and user feedback.
  - Summary document or notes on layout changes applied to each page.

- **Responsible**: UI Developer / Web Developer
- **Dependencies**: Access to current UI mockup files, user feedback on layout specifications.
- **Risks**: Misinterpretation of user feedback leading to incorrect layout changes. Mitigation: Review feedback carefully and confirm changes with the user if ambiguities arise.

### Step 2: Local Development Environment Setup (Week 2)
**Objective**: Establish a local development environment on the user's machine to run and test the Agentic System with the updated layout, simulating key functionalities for pre-cloud testing.

- **Tasks**:
  1. **Install Development Tools**:
     - Install Node.js (LTS version) to support a local web server and potential JavaScript framework usage (e.g., React for future dynamic features).
     - Install a code editor like Visual Studio Code for editing HTML, CSS, and JavaScript files if not already available.
     - Install a local web server tool like `http-server` (via npm) or use built-in Python server to serve the static HTML mockups.
  2. **Set Up Project Directory**:
     - Create a dedicated project directory on the local machine (e.g., `agentic_system_local`) and copy the updated `Webapp Mockup/` folder contents into it.
     - Ensure the directory structure maintains the integrity of file paths and links between HTML pages.
  3. **Run Local Server**:
     - Navigate to the project directory in a terminal or command prompt.
     - Run a local server to serve the mockups (e.g., `npx http-server` or `python -m http.server 8000`).
     - Access the application via a web browser at the local server address (e.g., `http://localhost:8080` or `http://localhost:8000`) starting with `index.html`.
  4. **Simulate Dynamic Features**:
     - Add placeholder JavaScript or static content to simulate dynamic interactions (e.g., mock data for project lists in `agentic_system_projects.html`, chat window text in the Live Agent Workspace).
     - Use basic HTML/CSS to create toggle interfaces in `agentic_system_settings.html` for feature enable/disable simulation.
  5. **Test Layout Changes**:
     - Verify that navigation reflects the updated hierarchy (Projects as main page with sub-pages, Web Automation before Settings).
     - Test visibility notes (e.g., Dashboard and Settings admin restrictions noted) and ensure sub-page relationships are visually clear.
  6. **Document Local Setup**:
     - Create a brief guide or README file in the project directory detailing how to start the local server, access the application, and navigate the updated layout for user reference.

- **Deliverables**:
  - Local project directory with updated UI mockups ready for testing.
  - Running local web server to serve the Agentic System mockups.
  - Simulated dynamic features with placeholder content for testing.
  - Documentation or README file for local setup and navigation instructions.

- **Responsible**: Web Developer / User (with provided instructions)
- **Dependencies**: Completion of Step 1 layout changes, user machine with necessary permissions to install tools.
- **Risks**: Compatibility issues with local tools or server setup on the user's machine. Mitigation: Provide multiple options for local server setup (e.g., Node.js, Python) and detailed troubleshooting steps in documentation.

## Deliverables Summary

- **Week 1 (Layout Changes)**: Updated UI mockup HTML files in `Webapp Mockup/` directory reflecting the new structure (Projects as main page with sub-pages for Agents, Documents, Analytics; Web Automation prioritized before Settings; specific visibility and feature notes added), with a summary of changes documented.
- **Week 2 (Local Setup)**: Local development environment set up on the user's machine with a running web server to test the updated mockups, simulated dynamic features using placeholder content, and a README file or guide for starting and navigating the local application.

## Dependencies and Prerequisites

- Approval of this local setup and layout changes plan.
- Completion of layout changes before local setup to ensure the updated mockups are tested.
- Access to the user's local machine with permissions to install necessary development tools (Node.js, code editor, etc.).
- Availability of current UI mockup files in `Webapp Mockup/` directory for modification.
- User feedback on layout changes as the guiding specification for restructuring.

## Risks and Mitigation Strategies

- **Misinterpretation of Layout Feedback**: Incorrect implementation of layout changes due to unclear user feedback. Mitigation: Document each change with reference to specific user instructions and seek clarification if needed before finalizing updates.
- **Local Environment Issues**: Challenges in setting up a local server or installing tools due to user machine constraints or compatibility issues. Mitigation: Provide multiple setup options (e.g., different server tools) and detailed instructions with troubleshooting tips.
- **Time Constraints for Layout Changes**: Delays in updating all mockup files within Week 1 due to the number of changes required. Mitigation: Prioritize critical layout changes (e.g., navigation hierarchy) first and phase less critical updates if necessary.
- **Testing Limitations Locally**: Inability to fully simulate dynamic or cloud-dependent features locally. Mitigation: Use static placeholders or mock data to represent dynamic content, focusing on layout and navigation testing initially.

## Conclusion

This Local Setup and Layout Changes Plan provides a structured approach to address the user's request to run the Agentic System locally for testing features before cloud deployment, with an immediate focus on layout changes as prioritized. By updating the UI mockups to reflect the specified structural and navigational modifications in Week 1, and establishing a local development environment in Week 2, the user will be able to test the updated layout and simulate key functionalities. Successful completion of these steps within the 2-week timeline will lay the groundwork for further feature development and testing locally, ensuring a fully functioning project before moving to cloud infrastructure setup as outlined in the broader pre-production roadmap.
