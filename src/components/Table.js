import { useEffect, useMemo, useState } from "react";
import { useSortBy, useTable, usePagination, useGlobalFilter } from "react-table";
import { useRecoilState } from "recoil";
import { previewDetailsState, showState } from "../Atom/PreviewAtom";

export default function Table({ products }) {
    // * get and set state of preview component
    const [isShow, setIsShow] = useRecoilState(showState);
    const [previewDetails, setpreviewDetails] = useRecoilState(previewDetailsState);

    console.log(isShow, previewDetails);

    // * is open or not, store value od dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("All");
    // ? handle dropdown value change
    const filterHandler = (value) => {
        setIsOpen(false);
        if (value === "") {
            setFilterValue("All");
        } else {
            setFilterValue(value);
        }
        setGlobalFilter(value || undefined);
    };

    // * set up Columns and data for table
    const productsData = useMemo(() => [...products], [products]);
    const productsColumns = useMemo(
        () =>
            products[0]
                ? Object.keys(products[0])
                      .filter((key) => key !== "id" && key !== "description" && key !== "image")
                      .map((key) => {
                          if (key === "rating") {
                              return {
                                  Header: key,
                                  accessor: key,
                                  Cell: ({ value }) => {
                                      if (value.rate > 3) {
                                          return (
                                              <span className="text-green-300 group-hover:text-black">
                                                  {value.rate + " ⭐"}
                                              </span>
                                          );
                                      }
                                      if (value.rate <= 3 && value.rate > 1) {
                                          return (
                                              <span className="text-orange-500 group-hover:text-black">
                                                  {value.rate + " ⭐"}
                                              </span>
                                          );
                                      }
                                      return (
                                          <span className="text-red-500 group-hover:text-black">
                                              {value.rate + " ⭐"}
                                          </span>
                                      );
                                  },
                              };
                          }

                          return {
                              Header: key,
                              accessor: key,
                          };
                      })
                : [],
        [products]
    );

    const exactTextCase = (rows, ids, filterValue) => {
        return rows.filter((row) => {
            return ids.some((id) => {
                const rowValue = row.values[id];
                return rowValue !== undefined ? String(rowValue) === String(filterValue) : true;
            });
        });
    };

    exactTextCase.autoRemove = (val) => !val;

    const filterTypes = useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            exactTextCase: exactTextCase,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, ids, filterValue) => {
                return rows.filter((row) => {
                    return ids.some((id) => {
                        const rowValue = row.values[id];
                        return rowValue !== undefined
                            ? String(rowValue).toLowerCase() === String(filterValue).toLowerCase()
                            : true;
                    });
                });
            },
        }),
        []
    );

    // * add new column to table
    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((productsColumns) => [
            ...productsColumns,
            {
                id: "Preview",
                Header: "Preview",
                Cell: ({ row }) => (
                    <img
                        onClick={() => {
                            setIsShow(true);
                            setpreviewDetails({
                                image: row.original.image,
                                desc: row.original.description,
                                rate: row.original.rating.rate,
                                title: row.original.title,
                                price: row.original.price,
                            });
                            // console.log(row.original.image);
                            // console.log(previewDetails);
                        }}
                        src="/img/external-link-2.png"
                        className="w-7 h-7 mx-auto cursor-pointer"
                        alt=""
                    />
                ),
            },
        ]);
    };

    const tableInstance = useTable(
        { columns: productsColumns || [], data: productsData || [], filterTypes },
        useGlobalFilter,
        tableHooks,
        useSortBy,
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        prepareRow,
        pageOptions,
        setPageSize,
        setGlobalFilter,
        state,
    } = tableInstance;

    const { pageIndex } = state;

    useEffect(() => {
        setPageSize(5);
    }, [setPageSize]);

    return (
        <>
            <table className="border-collapse rounded" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, index) => (
                                <th
                                    className={`${index === 0 && "rounded-tl-lg"} ${
                                        index === 5 && "rounded-tr-lg"
                                    } border border-green-400 p-4 font-roboto text-xl text-yellow-300 tracking-widest`}
                                    {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    {column.isSorted ? (column.isSortedDesc ? "⬇️" : "⬆️") : ""}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                className="hover:bg-white/50 transition-colors duration-300 group"
                                {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            className="border border-green-400 p-3 font-mali text-xs group-hover:text-gray-900 text-gray-400 text-center"
                                            {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex items-center justify-between gap-x-16 py-8">
                <div className="flex items-center justify-center gap-x-16">
                    <button
                        className={`border-none bg-transparent ${!canPreviousPage && "hidden"}`}
                        onClick={() => previousPage()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-9 w-9 cursor-pointer text-yellow-300 hover:text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <span className="text-white font-montserrat text-xl tracking-widest">{` ${
                        pageIndex + 1
                    }  /  ${pageOptions.length} `}</span>
                    <button
                        className={`border-none bg-transparent ${!canNextPage && "hidden"}`}
                        onClick={() => nextPage()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-9 w-9 cursor-pointer text-yellow-300 hover:text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
                <div className="relative w-56 text-gray-500 font-roboto font-bold text-[15px] tracking-widest capitalize">
                    <div
                        onClick={() => setIsOpen((isOpen) => !isOpen)}
                        className="bg-slate-300 border border-black rounded py-1 px-4 cursor-pointer">
                        {filterValue}
                        <span className="ml-4">{isOpen ? "⬆️" : "⬇️"}</span>
                    </div>
                    {isOpen && (
                        <div className="absolute mt-4 bg-slate-300 border border-black rounded ">
                            <ul className="flex flex-col">
                                <li
                                    onClick={() => filterHandler("")}
                                    className="cursor-pointer px-4 py-1 hover:bg-gray-700 hover:text-white">
                                    all
                                </li>
                                <li
                                    onClick={() => filterHandler("jewelery")}
                                    className="cursor-pointer px-4 py-1 hover:bg-gray-700 hover:text-white">
                                    jewelery
                                </li>
                                <li
                                    onClick={() => filterHandler("electronics")}
                                    className="cursor-pointer px-4 py-1 hover:bg-gray-700 hover:text-white">
                                    electronics
                                </li>
                                <li
                                    onClick={() => filterHandler("women's clothing")}
                                    className="cursor-pointer px-4 py-1 hover:bg-gray-700 hover:text-white">
                                    women's clothing
                                </li>
                                <li
                                    onClick={() => filterHandler("men's clothing")}
                                    className="cursor-pointer px-4 py-1 hover:bg-gray-700 hover:text-white">
                                    men's clothing
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
