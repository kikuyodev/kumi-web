describe("404", () => {
    it("successfully loads", () => {
        cy.visit("/404");

        it("has a header", () => {
            cy.get("h1").should("contain", "404");
        });

        it("has a paragraph", () => {
            cy.get("p").should("contain", "Page not found");
        });
    });
});