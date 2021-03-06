'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _typeof = require('@babel/runtime/helpers/typeof');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.MTableHeader = MTableHeader;
exports.styles = exports['default'] = void 0;

var _extends2 = _interopRequireDefault(
  require('@babel/runtime/helpers/extends')
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray')
);

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties')
);

var _react = _interopRequireWildcard(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _reactBeautifulDnd = require('react-beautiful-dnd');

var _material = require('@mui/material');

var _styles = require('@mui/styles');

var CommonValues = _interopRequireWildcard(
  require('../../utils/common-values')
);

var _excluded = ['onColumnResized'];

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== 'object' && typeof obj !== 'function')
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj['default'] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function (key) {
          (0, _defineProperty2['default'])(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source)
        )
      : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          );
        });
  }
  return target;
}

function MTableHeader(_ref) {
  var onColumnResized = _ref.onColumnResized,
    props = (0, _objectWithoutProperties2['default'])(_ref, _excluded);
  var defaultMinColumnWidth = 20;
  var defaultMaxColumnWidth = 10000;

  var _React$useState = _react['default'].useState(undefined),
    _React$useState2 = (0, _slicedToArray2['default'])(_React$useState, 2),
    resizing = _React$useState2[0],
    setResizing = _React$useState2[1];

  var _React$useState3 = _react['default'].useState(0),
    _React$useState4 = (0, _slicedToArray2['default'])(_React$useState3, 2),
    lastX = _React$useState4[0],
    setLastX = _React$useState4[1];

  var handleMouseDown = function handleMouseDown(e, columnDef, colIndex) {
    var startX = e.clientX;
    var th = e.target.closest('th');
    var currentWidth =
      th && Math.round(+window.getComputedStyle(th).width.slice(0, -2));
    var initialColWidths =
      resizing === null || resizing === void 0
        ? void 0
        : resizing.initialColWidths;
    var nextWidth;
    var nextColIndex;

    if (props.tableWidth === 'full') {
      var nextTh = th.nextSibling;
      nextWidth =
        nextTh &&
        Math.round(+window.getComputedStyle(nextTh).width.slice(0, -2));
      nextColIndex = props.columns.findIndex(function (c) {
        return c.tableData.id === columnDef.tableData.id + 1;
      });
    } else if (!initialColWidths) {
      // Ensure we have all column widths in pixels
      initialColWidths = Array.from(th.parentNode.children).map(function (th) {
        return Math.round(+window.getComputedStyle(th).width.slice(0, -2));
      });
    }

    setLastX(startX);
    setResizing(
      _objectSpread(
        _objectSpread(
          {
            colIndex: colIndex,
            nextColIndex: nextColIndex,
            lastColData: _objectSpread(
              _objectSpread({}, columnDef.tableData),
              {},
              {
                width: currentWidth
              }
            )
          },
          nextColIndex && {
            lastNextColData: _objectSpread(
              _objectSpread({}, props.columns[nextColIndex].tableData),
              {},
              {
                width: nextWidth
              }
            )
          }
        ),
        {},
        {
          initialColWidths: initialColWidths,
          startX: startX
        }
      )
    );
  };

  var constrainedColumnResize = function constrainedColumnResize(
    col,
    lastWidth,
    offset
  ) {
    // Extra max/min are to avoid sudden column changes when a column that starts without
    // an explicit width is resized
    var constrainedNewWidth = Math.min(
      Math.max(col.maxWidth || defaultMaxColumnWidth, lastWidth), // Avoid sudden decrease in column width
      Math.max(
        Math.min(col.minWidth || defaultMinColumnWidth, lastWidth), // Avoid sudden increase in column width
        lastWidth + offset
      )
    );
    return constrainedNewWidth - lastWidth;
  };

  var handleMouseMove = _react['default'].useCallback(
    // Use usecallback to prevent triggering theuse effect too much
    function (e) {
      if (!resizing) return;

      if (e.preventDefault) {
        // prevent text in table being selected
        e.preventDefault();
      }

      var curX = e.clientX;
      var col = props.columns[resizing.colIndex];
      var alreadyOffset =
        col.tableData.additionalWidth - resizing.lastColData.additionalWidth;
      var offset = constrainedColumnResize(
        col,
        resizing.lastColData.width + alreadyOffset,
        curX - lastX
      );
      offset = Math.round(offset);
      var widths = [resizing.lastColData.width + alreadyOffset];

      if (props.tableWidth === 'full') {
        offset = -constrainedColumnResize(
          props.columns[resizing.nextColIndex],
          resizing.lastNextColData.width - alreadyOffset,
          -offset
        );
        widths.push(resizing.lastNextColData.width - alreadyOffset);
      }

      setLastX(curX);

      if (offset) {
        onColumnResized(
          col.tableData.id,
          offset,
          widths,
          resizing.initialColWidths
        );
      }
    },
    [lastX, resizing, onColumnResized]
  );

  var handleMouseUp = _react['default'].useCallback(
    function (e) {
      if (resizing && lastX !== resizing.startX) {
        onColumnResized(
          props.columns[resizing.colIndex].tableData.id,
          0,
          [],
          []
        );
      }

      setResizing(undefined);
    },
    [setResizing, resizing, lastX, onColumnResized]
  );

  (0, _react.useEffect)(
    function () {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return function () {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    },
    [handleMouseMove, handleMouseUp]
  ); // ONly reset the listeners if needed

  var renderActionsHeader = function renderActionsHeader() {
    var localization = _objectSpread(
      _objectSpread({}, MTableHeader.defaultProps.localization),
      props.localization
    );

    var width = CommonValues.actionsColumnWidth(props);
    return /*#__PURE__*/ _react['default'].createElement(
      _material.TableCell,
      {
        key: 'key-actions-column',
        padding: 'checkbox',
        className: props.classes.header,
        style: _objectSpread(
          _objectSpread(
            {
              textAlign: 'center'
            },
            props.headerStyle
          ),
          {},
          {
            width: width,
            boxSizing: 'border-box'
          }
        )
      },
      /*#__PURE__*/ _react['default'].createElement(
        _material.TableSortLabel,
        {
          hideSortIcon: true,
          disabled: true
        },
        localization.actions
      )
    );
  };

  var getCellStyle = function getCellStyle(columnDef) {
    var width = props.options.columnResizable
      ? CommonValues.reducePercentsInCalc(
          columnDef.tableData.width,
          props.scrollWidth
        )
      : columnDef.tableData.width;

    var style = _objectSpread(
      _objectSpread(
        _objectSpread(
          _objectSpread({}, props.headerStyle),
          columnDef.headerStyle
        ),
        {},
        {
          boxSizing: 'border-box',
          width: width
        },
        props.tableWidth === 'full' &&
          columnDef.minWidth && {
            minWidth: columnDef.minWidth
          }
      ),
      props.tableWidth === 'full' &&
        columnDef.maxWidth && {
          maxWidth: columnDef.maxWidth
        }
    );

    if (
      props.options.tableLayout === 'fixed' &&
      props.options.columnResizable &&
      columnDef.resizable !== false
    ) {
      style.paddingLeft = 8;
      style.paddingRight = 2;
      style.position = 'relative';
    }

    return style;
  };

  function RenderHeader() {
    var size = props.options.padding === 'default' ? 'medium' : 'small';
    return props.columns
      .filter(function (columnDef) {
        return !columnDef.hidden && !(columnDef.tableData.groupOrder > -1);
      })
      .sort(function (a, b) {
        return a.tableData.columnOrder - b.tableData.columnOrder;
      })
      .map(function (columnDef, index, allCols) {
        var content = columnDef.title;

        if (props.draggable && columnDef.draggable !== false) {
          content = /*#__PURE__*/ _react['default'].createElement(
            _reactBeautifulDnd.Draggable,
            {
              key: columnDef.tableData.id,
              draggableId: columnDef.tableData.id.toString(),
              index: index,
              style: {
                zIndex: 99
              }
            },
            function (provided, snapshot) {
              return /*#__PURE__*/ _react['default'].createElement(
                'div',
                (0, _extends2['default'])(
                  {
                    ref: provided.innerRef
                  },
                  provided.draggableProps,
                  provided.dragHandleProps,
                  {
                    style: snapshot.isDragging
                      ? provided.draggableProps.style
                      : {
                          position: 'relative',
                          minWidth: 0,
                          display: 'flex'
                        }
                  }
                ),
                columnDef.sorting !== false && props.sorting
                  ? /*#__PURE__*/ _react['default'].createElement(
                      RenderSortButton,
                      {
                        columnDef: columnDef,
                        orderBy: props.orderBy,
                        keepSortDirectionOnColumnSwitch:
                          props.keepSortDirectionOnColumnSwitch,
                        orderDirection: props.orderDirection,
                        icon: props.icons.SortArrow,
                        thirdSortClick: props.thirdSortClick,
                        onOrderChange: props.onOrderChange
                      },
                      columnDef.title
                    )
                  : columnDef.title
              );
            }
          );
        } else if (columnDef.sorting !== false && props.sorting) {
          content = /*#__PURE__*/ _react['default'].createElement(
            RenderSortButton,
            {
              columnDef: columnDef,
              orderBy: props.orderBy,
              keepSortDirectionOnColumnSwitch:
                props.keepSortDirectionOnColumnSwitch,
              orderDirection: props.orderDirection,
              icon: props.icons.SortArrow,
              thirdSortClick: props.thirdSortClick,
              onOrderChange: props.onOrderChange
            },
            columnDef.title
          );
        }

        if (columnDef.tooltip) {
          content = /*#__PURE__*/ _react['default'].createElement(
            _material.Tooltip,
            {
              title: columnDef.tooltip,
              placement: 'bottom'
            },
            /*#__PURE__*/ _react['default'].createElement('span', null, content)
          );
        }

        if (
          props.options.tableLayout === 'fixed' &&
          props.options.columnResizable &&
          columnDef.resizable !== false &&
          !(props.options.tableWidth === 'full' && index === allCols.length - 1)
        ) {
          var Resize = props.icons.Resize
            ? props.icons.Resize
            : function (props) {
                return /*#__PURE__*/ _react['default'].createElement(
                  'div',
                  (0, _extends2['default'])({}, props, {
                    'data-test-id': 'drag_handle'
                  })
                );
              };
          content = /*#__PURE__*/ _react['default'].createElement(
            'div',
            {
              className: props.classes.headerWrap
            },
            /*#__PURE__*/ _react['default'].createElement(
              'div',
              {
                className: props.classes.headerContent
              },
              content
            ),
            /*#__PURE__*/ _react['default'].createElement('div', null),
            /*#__PURE__*/ _react['default'].createElement(Resize, {
              className: props.classes.headerResize,
              style: {
                display: 'flex',
                justifyContent: 'center',
                color:
                  resizing !== null &&
                  resizing !== void 0 &&
                  resizing.col &&
                  resizing.col.tableData.id === columnDef.tableData.id
                    ? props.theme.palette.primary.main
                    : 'inherit'
              },
              onMouseDown: function onMouseDown(e) {
                return handleMouseDown(e, columnDef, index);
              }
            })
          );
        }

        var cellAlignment =
          columnDef.align !== undefined
            ? columnDef.align
            : ['numeric', 'currency'].indexOf(columnDef.type) !== -1
            ? 'right'
            : 'left';
        return /*#__PURE__*/ _react['default'].createElement(
          _material.TableCell,
          {
            key: columnDef.tableData.id,
            align: cellAlignment,
            className: props.classes.header,
            style: getCellStyle(columnDef),
            size: size,
            'aria-label': columnDef.ariaLabel
          },
          content
        );
      });
  }

  function renderSelectionHeader() {
    var selectionWidth = CommonValues.selectionMaxWidth(
      props,
      props.treeDataMaxLevel
    );
    return /*#__PURE__*/ _react['default'].createElement(
      _material.TableCell,
      {
        padding: 'none',
        key: 'key-selection-column',
        className: props.classes.header,
        style: _objectSpread(
          _objectSpread({}, props.headerStyle),
          {},
          {
            width: selectionWidth
          }
        )
      },
      props.showSelectAllCheckbox &&
        /*#__PURE__*/ _react['default'].createElement(
          _material.Checkbox,
          (0, _extends2['default'])(
            {
              indeterminate:
                props.selectedCount > 0 &&
                props.selectedCount < props.dataCount,
              checked:
                props.dataCount > 0 && props.selectedCount === props.dataCount,
              onChange: function onChange(event, checked) {
                return props.onAllSelected && props.onAllSelected(checked);
              }
            },
            props.options.headerSelectionProps
          )
        )
    );
  }

  function renderDetailPanelColumnCell() {
    return /*#__PURE__*/ _react['default'].createElement(_material.TableCell, {
      padding: 'none',
      key: 'key-detail-panel-column',
      className: props.classes.header,
      style: _objectSpread({}, props.headerStyle)
    });
  }

  function render() {
    var headers = RenderHeader();

    if (props.hasSelection) {
      headers.splice(0, 0, renderSelectionHeader());
    }

    if (props.showActionsColumn) {
      if (props.actionsHeaderIndex >= 0) {
        var endPos = 0;

        if (props.hasSelection) {
          endPos = 1;
        }

        headers.splice(
          props.actionsHeaderIndex + endPos,
          0,
          renderActionsHeader()
        );
      } else if (props.actionsHeaderIndex === -1) {
        headers.push(renderActionsHeader());
      }
    }

    if (props.hasDetailPanel && props.options.showDetailPanelIcon) {
      if (props.detailPanelColumnAlignment === 'right') {
        headers.push(renderDetailPanelColumnCell());
      } else {
        headers.splice(0, 0, renderDetailPanelColumnCell());
      }
    }

    if (props.isTreeData > 0) {
      headers.splice(
        0,
        0,
        /*#__PURE__*/ _react['default'].createElement(_material.TableCell, {
          padding: 'none',
          key: 'key-tree-data-header',
          className: props.classes.header,
          style: _objectSpread({}, props.headerStyle)
        })
      );
    }

    props.columns
      .filter(function (columnDef) {
        return columnDef.tableData.groupOrder > -1;
      })
      .forEach(function (columnDef) {
        headers.splice(
          0,
          0,
          /*#__PURE__*/ _react['default'].createElement(_material.TableCell, {
            padding: 'checkbox',
            key: 'key-group-header' + columnDef.tableData.id,
            className: props.classes.header,
            style: _objectSpread({}, props.headerStyle)
          })
        );
      });
    return /*#__PURE__*/ _react['default'].createElement(
      _material.TableHead,
      {
        ref: props.forwardedRef
      },
      /*#__PURE__*/ _react['default'].createElement(
        _material.TableRow,
        {
          className: props.classes.headerRow
        },
        headers
      )
    );
  }

  return render();
}

var computeNewOrderDirection = function computeNewOrderDirection(
  orderBy,
  orderDirection,
  columnDef,
  thirdSortClick,
  keepSortDirectionOnColumnSwitch
) {
  if (columnDef.tableData.id !== orderBy) {
    if (keepSortDirectionOnColumnSwitch) {
      // use the current sort order when switching columns if defined
      return orderDirection || 'asc';
    } else {
      return 'asc';
    }
  } else if (orderDirection === 'asc') {
    return 'desc';
  } else if (orderDirection === 'desc') {
    if (thirdSortClick) {
      // third sort click brings to no order direction after desc
      return '';
    } else {
      return 'asc';
    }
  }

  return 'asc';
};

function RenderSortButton(_ref2) {
  var columnDef = _ref2.columnDef,
    orderBy = _ref2.orderBy,
    keepSortDirectionOnColumnSwitch = _ref2.keepSortDirectionOnColumnSwitch,
    orderDirection = _ref2.orderDirection,
    icon = _ref2.icon,
    thirdSortClick = _ref2.thirdSortClick,
    onOrderChange = _ref2.onOrderChange,
    children = _ref2.children;
  var active = orderBy === columnDef.tableData.id; // If current sorted column or prop asked to
  // maintain sort order when switching sorted column,
  // follow computed order direction if defined
  // else default direction is asc

  var direction =
    active || keepSortDirectionOnColumnSwitch ? orderDirection || 'asc' : 'asc';
  var ariaSort = 'none';

  if (active && direction === 'asc') {
    ariaSort = columnDef.ariaSortAsc ? columnDef.ariaSortAsc : 'Ascendant';
  }

  if (active && direction === 'desc') {
    ariaSort = columnDef.ariaSortDesc ? columnDef.ariaSortDesc : 'Descendant';
  }

  return /*#__PURE__*/ _react['default'].createElement(
    _material.TableSortLabel,
    {
      role: '',
      'aria-sort': ariaSort,
      'aria-label': columnDef.ariaLabel,
      IconComponent: icon,
      active: active,
      'data-testid': 'mtableheader-sortlabel',
      direction: direction,
      onClick: function onClick() {
        var newOrderDirection = computeNewOrderDirection(
          orderBy,
          orderDirection,
          columnDef,
          thirdSortClick,
          keepSortDirectionOnColumnSwitch
        );
        onOrderChange(columnDef.tableData.id, newOrderDirection);
      }
    },
    children
  );
}

MTableHeader.defaultProps = {
  dataCount: 0,
  hasSelection: false,
  headerStyle: {},
  selectedCount: 0,
  sorting: true,
  keepSortDirectionOnColumnSwitch: true,
  localization: {
    actions: 'Actions'
  },
  orderBy: undefined,
  orderDirection: 'asc',
  actionsHeaderIndex: 0,
  detailPanelColumnAlignment: 'left',
  draggable: true,
  thirdSortClick: true
};
MTableHeader.propTypes = {
  columns: _propTypes['default'].array.isRequired,
  dataCount: _propTypes['default'].number,
  hasDetailPanel: _propTypes['default'].bool.isRequired,
  detailPanelColumnAlignment: _propTypes['default'].string,
  hasSelection: _propTypes['default'].bool,
  headerStyle: _propTypes['default'].object,
  localization: _propTypes['default'].object,
  selectedCount: _propTypes['default'].number,
  sorting: _propTypes['default'].bool,
  keepSortDirectionOnColumnSwitch: _propTypes['default'].bool,
  onAllSelected: _propTypes['default'].func,
  onOrderChange: _propTypes['default'].func,
  orderBy: _propTypes['default'].number,
  orderDirection: _propTypes['default'].string,
  actionsHeaderIndex: _propTypes['default'].number,
  showActionsColumn: _propTypes['default'].bool,
  showSelectAllCheckbox: _propTypes['default'].bool,
  draggable: _propTypes['default'].bool,
  thirdSortClick: _propTypes['default'].bool,
  tooltip: _propTypes['default'].string
};

var styles = function styles(theme) {
  return {
    headerRow: {
      zIndex: 10
    },
    header: {
      // display: 'inline-block',
      // position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.background.paper // Change according to theme,
    },
    headerWrap: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      left: 4
    },
    headerContent: {
      minWidth: 0,
      display: 'flex',
      flex: '1 0 100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      position: 'relative'
    },
    headerResize: {
      flex: 1,
      cursor: 'col-resize',
      position: 'absolute',
      // allow div to straddle adjacent columns
      height: '100%',
      width: 16,
      right: -8,
      zIndex: 20 // so half that overlaps next column can be used to resize
    }
  };
};

exports.styles = styles;

var MTableHeaderRef = /*#__PURE__*/ _react['default'].forwardRef(
  function MTableHeaderRef(props, ref) {
    return /*#__PURE__*/ _react['default'].createElement(
      MTableHeader,
      (0, _extends2['default'])({}, props, {
        forwardedRef: ref
      })
    );
  }
);

var _default = (0, _styles.withStyles)(styles, {
  name: 'MTableHeader',
  withTheme: true
})(MTableHeaderRef);

exports['default'] = _default;
