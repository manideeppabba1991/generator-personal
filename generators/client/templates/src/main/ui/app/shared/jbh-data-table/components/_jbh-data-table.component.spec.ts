import {TestBed, async} from '@angular/core/testing';
import {JBHDataTableComponent} from './jbh-data-table.component';
import {JBHDataTableModule} from '../jbh-data-table.module';
describe('Datatable component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ JBHDataTableModule ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  describe('When the column is sorted with a custom comparator', () => {

    it('should return a new array', () => {
      let fixture = TestBed.createComponent(JBHDataTableComponent);
      let initialRows = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];

      let columns = [
        {
          prop: 'foo',
          comparator: (propA, propB) => {
            if (propA.toLowerCase() > propB.toLowerCase()) return -1;
            if (propA.toLowerCase() < propB.toLowerCase()) return 1;
          }
        }
      ];

      fixture.componentInstance.rows = initialRows;
      fixture.componentInstance.columns = columns;

      fixture.detectChanges();

      expect(fixture.componentInstance.rows).toBe(initialRows);

      fixture.componentInstance.onColumnSort({
        sorts: [{ prop: 'foo', dir: 'desc' }]
      });

      fixture.componentInstance.sort
        .subscribe(() => {
          console.log('sorted event');
        });

      expect(fixture.componentInstance.rows).not.toBe(initialRows);
    });
  });

});
