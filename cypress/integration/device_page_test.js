describe('Device page tests', () => {
  context('no access before login', () => {
    before(() => {
      cy.fixture('device').as('device');
    });

    it('redirects to login', function () {
      cy.visit(`/devices/${this.device.data.id}`);
      cy.location('pathname').should('eq', '/login');
    });
  });

  context('authenticated', () => {
    beforeEach(() => {
      cy.fixture('device').as('device');
      cy.fixture('device_detailed').as('deviceDetailed');
    });

    it('successfully loads Device page', function () {
      cy.server();
      cy.route('GET', '/appengine/v1/*/devices/*', '@device');
      cy.login();
      cy.visit(`/devices/${this.device.data.id}`);
      cy.location('pathname').should('eq', `/devices/${this.device.data.id}`);
      cy.get('h2').contains('Device');
    });

    it('displays correct properties for a device', function () {
      cy.get('.main-content').within(() => {
        cy.contains('Device Info')
          .next()
          .within(() => {
            cy.contains('Device ID').next().contains(this.device.data.id);
            cy.contains('Device name').next().contains('No name alias set');
            cy.contains('Status').next().contains('Never connected');
            cy.contains('Credentials inhibited').next().contains('False');
            cy.contains('Inhibit credentials').should('not.be.disabled');
            cy.contains('Enable credentials request').should('not.exist');
            cy.contains('Wipe credential secret').should('not.be.disabled');
          });

        cy.contains('Aliases')
          .next()
          .within(() => {
            cy.contains('Device has no aliases');
            cy.contains('Add new alias').should('not.be.disabled');
          });

        cy.contains('Metadata')
          .next()
          .within(() => {
            cy.contains('Device has no metadata');
            cy.contains('Add new item').should('not.be.disabled');
          });

        cy.contains('Groups')
          .next()
          .within(() => {
            cy.contains('Device does not belong to any group');
            cy.contains('Add to existing group').should('not.be.disabled');
          });

        cy.contains('Interfaces')
          .next()
          .within(() => {
            cy.contains('No introspection info');
          });

        cy.contains('Previous Interfaces')
          .next()
          .within(() => {
            cy.contains('No previous interfaces info');
          });

        cy.contains('Device Stats');

        cy.contains('Device Status Events');

        cy.contains('Device Live Events');
      });
    });

    it('successfully loads Device page for a detailed device', function () {
      cy.server();
      cy.route('GET', '/appengine/v1/*/devices/*', '@deviceDetailed');
      cy.login();
      cy.visit(`/devices/${this.deviceDetailed.data.id}`);
      cy.location('pathname').should('eq', `/devices/${this.deviceDetailed.data.id}`);
      cy.get('h2').contains('Device');
    });

    it('displays correct properties for a detailed device', function () {
      cy.get('.main-content').within(() => {
        cy.contains('Device Info')
          .next()
          .within(() => {
            cy.contains('Device ID').next().contains(this.deviceDetailed.data.id);
            cy.contains('Device name').next().contains(this.deviceDetailed.data.aliases.name);
            cy.contains('Status').next().contains('Connected');
            cy.contains('Credentials inhibited').next().contains('True');
            cy.contains('Enable credentials request').should('not.be.disabled');
            cy.contains('Inhibit credentials').should('not.exist');
            cy.contains('Wipe credential secret').should('not.be.disabled');
          });

        cy.contains('Aliases')
          .next()
          .within(() => {
            Object.entries(this.deviceDetailed.data.aliases).forEach(([aliasKey, aliasValue]) => {
              cy.contains(aliasKey).next().contains(aliasValue);
            });
            cy.contains('Add new alias').should('not.be.disabled');
          });

        cy.contains('Metadata')
          .next()
          .within(() => {
            Object.entries(this.deviceDetailed.data.metadata).forEach(
              ([metadataKey, metadataValue]) => {
                cy.contains(metadataKey).next().contains(metadataValue);
              },
            );
            cy.contains('Add new item').should('not.be.disabled');
          });

        cy.contains('Groups')
          .next()
          .within(() => {
            this.deviceDetailed.data.groups.forEach((group) => {
              cy.contains(group);
            });
            cy.contains('Add to existing group').should('not.be.disabled');
          });

        cy.contains('Interfaces')
          .next()
          .within(() => {
            Object.entries(this.deviceDetailed.data.introspection).forEach(([interfaceName]) => {
              cy.contains(interfaceName);
            });
          });

        cy.contains('Previous Interfaces')
          .next()
          .within(() => {
            this.deviceDetailed.data.previous_interfaces.forEach((interface) => {
              cy.contains(interface.name);
            });
          });

        cy.contains('Device Stats');

        cy.contains('Device Status Events')
          .next()
          .within(() => {
            cy.contains('Last seen IP').next().contains(this.deviceDetailed.data.last_seen_ip);
            cy.contains('Last credentials request IP')
              .next()
              .contains(this.deviceDetailed.data.last_credentials_request_ip);
            cy.contains('First credentials request');
            cy.contains('First registration');
            cy.contains('Last connection');
            cy.contains('Last disconnection');
          });

        cy.contains('Device Live Events');
      });
    });
  });
});
