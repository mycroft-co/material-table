'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _typeof = require('@babel/runtime/helpers/typeof');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.MTableToolbar = MTableToolbar;
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

var _styles = require('@mui/styles');

var _material = require('@mui/material');

var _classnames = _interopRequireDefault(require('classnames'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _react = _interopRequireWildcard(require('react'));

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

var searchTimer;

function MTableToolbar(props) {
  var _useState = (0, _react.useState)(props.searchText),
    _useState2 = (0, _slicedToArray2['default'])(_useState, 2),
    searchText = _useState2[0],
    setSearchText = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2['default'])(_useState3, 2),
    exportButtonAnchorEl = _useState4[0],
    setExportButtonAnchorEl = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2['default'])(_useState5, 2),
    columnsButtonAnchorEl = _useState6[0],
    setColumnsButtonAnchorEl = _useState6[1];

  var onSearchChange = function onSearchChange(searchText) {
    setSearchText(searchText);
    props.dataManager.changeSearchText(searchText);

    if (!props.isRemoteData) {
      props.onSearchChanged(searchText);
      return;
    }

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(function () {
      props.onSearchChanged(searchText);
      searchTimer = null;
    }, props.searchDebounceDelay);
  };

  var getTableData = function getTableData() {
    var columns = props.columns
      .filter(function (columnDef) {
        return (
          (!columnDef.hidden || columnDef['export'] === true) &&
          columnDef.field &&
          columnDef['export'] !== false
        );
      })
      .sort(function (a, b) {
        return a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1;
      });
    var data = (props.exportAllData ? props.data : props.renderData).map(
      function (rowData) {
        return columns.reduce(function (agg, columnDef) {
          var value;
          /*
        About: column.customExport
        This bit of code checks if prop customExport in column is a function, and if it is then it
        uses that function to transform the data, this is useful in cases where a column contains
        complex objects or array and it needs to be handled before it's passed to the exporter
        to avoid [object Object] output (e.g. to flatten data).
        Please note that it is also possible to transform data within under exportMenu
        using a custom function (exportMenu.exportFunc) for each exporter.
        */

          if (typeof columnDef.customExport === 'function') {
            value = columnDef.customExport(rowData);
          } else {
            value = props.getFieldValue(rowData, columnDef);
          }

          agg[columnDef.field] = value;
          return agg;
        }, {});
      }
    );
    return [columns, data];
  };

  function renderSearch() {
    var localization = _objectSpread(
      _objectSpread({}, MTableToolbar.defaultProps.localization),
      props.localization
    );

    if (props.search) {
      return /*#__PURE__*/ _react['default'].createElement(
        _material.TextField,
        {
          autoFocus: props.searchAutoFocus,
          className:
            props.searchFieldAlignment === 'left' && props.showTitle === false
              ? null
              : props.classes.searchField,
          value: searchText,
          onChange: function onChange(event) {
            return onSearchChange(event.target.value);
          },
          placeholder: localization.searchPlaceholder,
          variant: props.searchFieldVariant,
          InputProps: {
            startAdornment: /*#__PURE__*/ _react['default'].createElement(
              _material.InputAdornment,
              {
                position: 'start'
              },
              /*#__PURE__*/ _react['default'].createElement(
                _material.Tooltip,
                {
                  title: localization.searchTooltip
                },
                /*#__PURE__*/ _react['default'].createElement(
                  props.icons.Search,
                  {
                    fontSize: 'small'
                  }
                )
              )
            ),
            endAdornment: /*#__PURE__*/ _react['default'].createElement(
              _material.InputAdornment,
              {
                position: 'end'
              },
              /*#__PURE__*/ _react['default'].createElement(
                _material.IconButton,
                {
                  disabled: !searchText,
                  onClick: function onClick() {
                    return onSearchChange('');
                  },
                  'aria-label': localization.clearSearchAriaLabel
                },
                /*#__PURE__*/ _react['default'].createElement(
                  props.icons.ResetSearch,
                  {
                    fontSize: 'small',
                    'aria-label': 'clear'
                  }
                )
              )
            ),
            style: props.searchFieldStyle,
            inputProps: {
              'aria-label': localization.searchAriaLabel
            }
          }
        }
      );
    } else {
      return null;
    }
  }

  function renderDefaultActions() {
    var localization = _objectSpread(
      _objectSpread({}, MTableToolbar.defaultProps.localization),
      props.localization
    );

    var classes = props.classes;
    return /*#__PURE__*/ _react['default'].createElement(
      'div',
      {
        style: {
          display: 'flex'
        }
      },
      props.columnsButton &&
        /*#__PURE__*/ _react['default'].createElement(
          'span',
          null,
          /*#__PURE__*/ _react['default'].createElement(
            _material.Tooltip,
            {
              title: localization.showColumnsTitle
            },
            /*#__PURE__*/ _react['default'].createElement(
              _material.IconButton,
              {
                color: 'inherit',
                onClick: function onClick(event) {
                  return setColumnsButtonAnchorEl(event.currentTarget);
                },
                'aria-label': localization.showColumnsAriaLabel
              },
              /*#__PURE__*/ _react['default'].createElement(
                props.icons.ViewColumn,
                null
              )
            )
          ),
          /*#__PURE__*/ _react['default'].createElement(
            _material.Menu,
            {
              anchorEl: columnsButtonAnchorEl,
              open: Boolean(columnsButtonAnchorEl),
              onClose: function onClose() {
                return setColumnsButtonAnchorEl(null);
              }
            },
            /*#__PURE__*/ _react['default'].createElement(
              _material.MenuItem,
              {
                key: 'text',
                disabled: true,
                style: {
                  opacity: 1,
                  fontWeight: 600,
                  fontSize: 12
                }
              },
              localization.addRemoveColumns
            ),
            props.columns.map(function (col) {
              var hiddenFromColumnsButtonMenu =
                col.hiddenByColumnsButton !== undefined
                  ? col.hiddenByColumnsButton
                  : props.columnsHiddenInColumnsButton;

              if (hiddenFromColumnsButtonMenu) {
                return null;
              }

              return /*#__PURE__*/ _react['default'].createElement(
                'li',
                {
                  key: col.tableData.id
                },
                /*#__PURE__*/ _react['default'].createElement(
                  _material.MenuItem,
                  {
                    className: classes.formControlLabel,
                    component: 'label',
                    htmlFor: 'column-toggle-'.concat(col.tableData.id),
                    disabled: col.removable === false
                  },
                  /*#__PURE__*/ _react['default'].createElement(
                    _material.Checkbox,
                    {
                      checked: !col.hidden,
                      id: 'column-toggle-'.concat(col.tableData.id),
                      onChange: function onChange() {
                        return props.onColumnsChanged(col, !col.hidden);
                      }
                    }
                  ),
                  /*#__PURE__*/ _react['default'].createElement(
                    'span',
                    null,
                    col.title
                  )
                )
              );
            })
          )
        ),
      props.exportMenu.length > 0 &&
        /*#__PURE__*/ _react['default'].createElement(
          'span',
          null,
          /*#__PURE__*/ _react['default'].createElement(
            _material.Tooltip,
            {
              title: localization.exportTitle
            },
            /*#__PURE__*/ _react['default'].createElement(
              _material.IconButton,
              {
                color: 'inherit',
                onClick: function onClick(event) {
                  return setExportButtonAnchorEl(event.currentTarget);
                },
                'aria-label': localization.exportAriaLabel
              },
              /*#__PURE__*/ _react['default'].createElement(
                props.icons.Export,
                null
              )
            )
          ),
          /*#__PURE__*/ _react['default'].createElement(
            _material.Menu,
            {
              anchorEl: exportButtonAnchorEl,
              open: Boolean(exportButtonAnchorEl),
              onClose: function onClose() {
                return setExportButtonAnchorEl(null);
              }
            },
            props.exportMenu.map(function (menuitem, index) {
              var _getTableData = getTableData(),
                _getTableData2 = (0, _slicedToArray2['default'])(
                  _getTableData,
                  2
                ),
                cols = _getTableData2[0],
                datas = _getTableData2[1];

              return /*#__PURE__*/ _react['default'].createElement(
                _material.MenuItem,
                {
                  key: ''.concat(menuitem.label).concat(index),
                  onClick: function onClick() {
                    menuitem.exportFunc(cols, datas, {
                      searchedData: props.dataManager.searchedData,
                      filteredData: props.dataManager.filteredData,
                      groupedData: props.dataManager.groupedData
                    });
                    setExportButtonAnchorEl(null);
                  }
                },
                menuitem.label
              );
            })
          )
        ),
      /*#__PURE__*/ _react['default'].createElement(
        'span',
        null,
        /*#__PURE__*/ _react['default'].createElement(
          props.components.Actions,
          {
            actions:
              props.actions &&
              props.actions.filter(function (a) {
                return a.position === 'toolbar';
              }),
            components: props.components
          }
        )
      )
    );
  }

  function renderSelectedActions() {
    return /*#__PURE__*/ _react['default'].createElement(
      _react['default'].Fragment,
      null,
      /*#__PURE__*/ _react['default'].createElement(props.components.Actions, {
        actions: props.actions.filter(function (a) {
          return a.position === 'toolbarOnSelect';
        }),
        data: props.selectedRows,
        components: props.components
      })
    );
  }

  function renderActions() {
    var classes = props.classes;
    return /*#__PURE__*/ _react['default'].createElement(
      'div',
      {
        className: classes.actions
      },
      /*#__PURE__*/ _react['default'].createElement(
        'div',
        null,
        props.selectedRows && props.selectedRows.length > 0
          ? renderSelectedActions()
          : renderDefaultActions()
      )
    );
  }

  function renderToolbarTitle(title) {
    var classes = props.classes;
    var toolBarTitle = // eslint-disable-next-line multiline-ternary
      typeof title === 'string'
        ? /*#__PURE__*/ _react['default'].createElement(
            _material.Typography,
            {
              variant: 'h6',
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            },
            title
          )
        : title;
    return /*#__PURE__*/ _react['default'].createElement(
      'div',
      {
        className: classes.title
      },
      toolBarTitle
    );
  }

  function render() {
    var classes = props.classes;

    var localization = _objectSpread(
      _objectSpread({}, MTableToolbar.defaultProps.localization),
      props.localization
    );

    var title =
      props.showTextRowsSelected &&
      props.selectedRows &&
      props.selectedRows.length > 0
        ? typeof localization.nRowsSelected === 'function'
          ? localization.nRowsSelected(props.selectedRows.length)
          : localization.nRowsSelected.replace('{0}', props.selectedRows.length)
        : props.showTitle
        ? props.title
        : null;
    return /*#__PURE__*/ _react['default'].createElement(
      _material.Toolbar,
      {
        ref: props.forwardedRef,
        className: (0, _classnames['default'])(
          classes.root,
          (0, _defineProperty2['default'])(
            {},
            classes.highlight,
            props.showTextRowsSelected &&
              props.selectedRows &&
              props.selectedRows.length > 0
          )
        )
      },
      title && renderToolbarTitle(title),
      props.searchFieldAlignment === 'left' && renderSearch(),
      props.toolbarButtonAlignment === 'left' && renderActions(),
      /*#__PURE__*/ _react['default'].createElement('div', {
        className: classes.spacer
      }),
      props.searchFieldAlignment === 'right' && renderSearch(),
      props.toolbarButtonAlignment === 'right' && renderActions()
    );
  }

  return render();
}

MTableToolbar.defaultProps = {
  actions: [],
  columns: [],
  columnsHiddenInColumnsButton: false,
  // By default, all columns are shown in the Columns Button (columns action when `options.columnsButton = true`)
  columnsButton: false,
  localization: {
    addRemoveColumns: 'Add or remove columns',
    nRowsSelected: '{0} row(s) selected',
    showColumnsTitle: 'Show Columns',
    showColumnsAriaLabel: 'Show Columns',
    exportTitle: 'Export',
    exportAriaLabel: 'Export',
    searchTooltip: 'Search',
    searchPlaceholder: 'Search',
    searchAriaLabel: 'Search',
    clearSearchAriaLabel: 'Clear Search'
  },
  search: true,
  showTitle: true,
  searchText: '',
  showTextRowsSelected: true,
  toolbarButtonAlignment: 'right',
  searchAutoFocus: false,
  searchFieldAlignment: 'right',
  searchFieldVariant: 'standard',
  selectedRows: [],
  title: 'No Title!'
};
MTableToolbar.propTypes = {
  actions: _propTypes['default'].array,
  columns: _propTypes['default'].array,
  columnsButton: _propTypes['default'].bool,
  components: _propTypes['default'].object.isRequired,
  getFieldValue: _propTypes['default'].func.isRequired,
  localization: _propTypes['default'].object.isRequired,
  onColumnsChanged: _propTypes['default'].func.isRequired,
  dataManager: _propTypes['default'].object.isRequired,
  searchText: _propTypes['default'].string,
  onSearchChanged: _propTypes['default'].func.isRequired,
  search: _propTypes['default'].bool.isRequired,
  searchFieldStyle: _propTypes['default'].object,
  searchFieldVariant: _propTypes['default'].string,
  selectedRows: _propTypes['default'].array,
  title: _propTypes['default'].oneOfType([
    _propTypes['default'].element,
    _propTypes['default'].string
  ]),
  showTitle: _propTypes['default'].bool.isRequired,
  showTextRowsSelected: _propTypes['default'].bool.isRequired,
  toolbarButtonAlignment: _propTypes['default'].string.isRequired,
  searchFieldAlignment: _propTypes['default'].string.isRequired,
  renderData: _propTypes['default'].array,
  data: _propTypes['default'].array,
  exportAllData: _propTypes['default'].bool,
  exportMenu: _propTypes['default'].arrayOf(
    _propTypes['default'].shape({
      name: _propTypes['default'].string,
      handler: _propTypes['default'].func
    })
  ),
  classes: _propTypes['default'].object,
  searchAutoFocus: _propTypes['default'].bool
};

var styles = function styles(theme) {
  return {
    root: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(2)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: (0, _styles.lighten)(
              theme.palette.secondary.light,
              0.85
            )
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    spacer: {
      flex: '1 1 10%'
    },
    actions: {
      color: theme.palette.text.secondary
    },
    title: {
      overflow: 'hidden'
    },
    searchField: {
      minWidth: 150,
      paddingLeft: theme.spacing(2)
    },
    formControlLabel: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  };
};

exports.styles = styles;

var MTableToolbarRef = /*#__PURE__*/ _react['default'].forwardRef(
  function MTableToolbarRef(props, ref) {
    return /*#__PURE__*/ _react['default'].createElement(
      MTableToolbar,
      (0, _extends2['default'])({}, props, {
        forwardedRef: ref
      })
    );
  }
);

var _default = (0, _styles.withStyles)(styles, {
  name: 'MTableToolbar'
})(MTableToolbarRef);

exports['default'] = _default;
