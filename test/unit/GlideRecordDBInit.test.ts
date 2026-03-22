

import {GlideRecordDBInit} from '../../src/common/GlideRecordDBInit';
import * as path from 'path';


describe('GlideRecordDBInit', () => {
    it('should initialize GlideRecordDBTypes', async () => {
          const fileName = 'glide.server.d.ts';

          //const currentPath = path.basename(__dirname);
        const modulePath = path.resolve(__dirname, fileName);
        const interfaceName = 'incident';



        const tableDef = {}; // Mock table definition
        await GlideRecordDBInit.initializeGlideRecordDBTypes(modulePath, interfaceName);
        // Add assertions to verify the expected behavior
    });
});