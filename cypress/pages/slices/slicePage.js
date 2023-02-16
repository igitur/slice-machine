export class SlicePage {
  get saveButton() {
    return cy.contains("Save to File System");
  }
  get imagePreview() {
    return cy.get("[alt='Preview image']");
  }

  get imagePreviewSrc() {
    this.imagePreview.then(($img) => {
      return $img.attr("src");
    });
  }

  goTo(sliceLibrary, sliceName) {
    cy.visit(`/${sliceLibrary}/${sliceName}/default`);
    this.saveButton.should("be.visible");
    cy.contains(sliceName).should("be.visible");
    return this;
  }

  openScreenshotModal() {
    cy.contains("Update screenshot").click();
    return this;
  }

  openVariationModal() {
    cy.get("[aria-label='Expand variations']").parent().click();
    cy.contains("Add new variation").click();
    return this;
  }

  changeToVariation(startVariation, targetVariation) {
    cy.get("button").contains(startVariation).click();
    cy.contains(targetVariation).click();
    return this;
  }

  save() {
    this.saveButton.click();
    this.saveButton.should("be.disabled");
    cy.contains("Models & mocks have been generated successfully").should(
      "be.visible"
    );
    return this;
  }

  openSimulator() {
    cy.contains("Simulate Slice").click();
    return this;
  }

  /**
   * add a new variation through the variation modal.
   *
   * @param {string} variationName Name of the variation.
   */
  addVariation(variationName) {
    cy.get("[aria-label='Expand variations']").click({ force: true });
    cy.contains("button", "Add new variation").click();

    cy.get("[aria-modal]").within(() => {
      cy.getInputByLabel("Variation name*").type(variationName);
      cy.contains("button", "Submit").click();
    });
    cy.get("[aria-modal]").should("not.exist");

    return this;
  }

  /**
   * add a new widget through the modal form.
   *
   * @param {string} name Name of the widget field.
   * @param {string} type Type of the widget.
   */
  addNewWidgetField(name, type) {
    cy.get("[data-cy='add-Static-field']").click();
    cy.get("[aria-label='Widget Form Modal']").should("be.visible");

    cy.contains("div", type).click();

    const nameInput = '[data-cy="new-field-name-input"]';

    cy.get(nameInput).clear();
    cy.get(nameInput).type(name).blur();

    cy.contains(/^Add$/).click();

    return this;
  }

  /**
   * Get the relevant edit widget modal.
   *
   * @param {string} name Name of the widget field.
   */
  getWidgetField(name) {
    return cy.contains("div", name).parent();
  }

  /**
   * Open the relevant edit widget modal.
   *
   * @param {string} name Name of the widget field.
   */
  openEditWidgetModal(name) {
    cy.contains("div", name)
      .parent()
      .find("[aria-label='Edit slice field']")
      .click();

    return this;
  }

  /**
   * delete the relevant edit widget modal.
   *
   * @param {string} name Name of the widget field.
   */
  deleteWidgetField(name) {
    cy.contains("div", name)
      .parent()
      .find("[data-cy='slice-menu-button']")
      .click();

    cy.contains("div", "Delete field").click({ force: true });

    cy.contains("div", name).should("not.exist");

    return this;
  }
}