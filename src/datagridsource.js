export const Productscolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.2,
  },

  {
    field: "name",
    headerName: "Nom",
    flex: 1,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.img
                ? params.row.img
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="avatar"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "40%",
              objectFit: "cover",
            }}
          />
          {params.row.username}
        </div>
      );
    },
  },

  {
    field: "buy_price",
    headerName: "Prix d'achat",
    flex: 0.5,
  },
  {
    field: "in_stock",
    headerName: "en Stock",
    flex: 0.4,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "timestamp",
    headerName: "Date",
    flex: 0.5,
    renderCell: ({ value }) => value ? new Date(value.seconds * 1000).toLocaleString() : null,
  },
];


export const Supplierscolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "full_name",
    headerName: "Nom et prénom",
    flex: 0.5,
  },
  {
    field: "phone",
    headerName: "Numéro de téléphone",
    flex: 0.5,
  },
  {
    field: "address",
    headerName: "Adresse",
    flex: 0.5,
  },
];
export const Shipmentscolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "supplier",
    headerName: "Fournisseur",
    flex: 0.5,
  },
  {
    field: "products",
    headerName: "Des Produits",
    renderCell: ({ value }) => (
      <ul>
        {value.map((product) => (
          <li key={product.id}>
            <span
              style={{
                margin: "5px",
                fontWeight: "bold",
              }}
            >
              {" "}
              {product.name}
            </span>
            |
            <span
              style={{
                margin: "5px",
                fontWeight: "bold",
              }}
            >
              {product.in_stock} en Stock
            </span>
          </li>
        ))}
      </ul>
    ),
    flex: 1,
  },
  {
    field: "timestamp",
    headerName: "Date",
    flex: 0.5,
    renderCell: ({ value }) => value ? new Date(value.seconds * 1000).toLocaleString() : null,
  },
  {
    field: "shipements_price",
    headerName: "Price",
    flex: 0.5,
  },
];
export const Salescolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.2,
  },
  {
    field: "product_name",
    headerName: "Nom du produit",
    flex: 0.5,
  },
  {
    field: "product_buy_price",
    headerName: "Prix d'achat",
    flex: 0.3,
  },
  {
    field: "product_sell_price",
    headerName: "Prix ​​de vente",
    flex: 0.3,
  },
  {
    field: "sell_qantity",
    headerName: "Quantité",
    flex: 0.2,
  },
  {
    field: "sell_totalprice",
    headerName: "Prix ​​Total",
    flex: 0.5,
  },
  {
    field: "sell_profit",
    headerName: "Profit",
    flex: 0.3,
    renderCell: ({ value }) => {
      const style = {
        color: value > 0 ? "lightgreen" : "red",
      };
      return <div style={style}>{value}</div>;
    },
  },
  {
    field: "timestamp",
    headerName: "Date",
    flex: 0.5,
    renderCell: ({ value }) => value ? new Date(value.seconds * 1000).toLocaleString() : null,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 0.5,
  },
];
export const Expenses_Services_columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 0.5,
  },

 
  {
    field: "sell_profit",
    headerName: "Prix",
    flex: 0.5,
  },
  {
    field: "timestamp",
    headerName: "Date",
    flex: 0.5,
    renderCell: ({ value }) => value ? new Date(value.seconds * 1000).toLocaleString() : null,
  },
];
export const ProductsIncomecolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "product_name",
    headerName: "Product Name",
    flex: 0.5,
  },

  {
    field: "product_buy_price",
    headerName: "Buy Price",
    flex: 0.5,
  },
  {
    field: "product_sell_price",
    headerName: "Buy Price",
    flex: 0.5,
  },
  {
    field: "product_profit",
    headerName: "Profit",
    flex: 0.5,
    renderCell: ({ value }) => {
      const style = {
        color: value > 0 ? "lightgreen" : "red",
      };
      return <div style={style}>{value}</div>;
    },
  },
];

export const Histotycolumns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.2,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 0.5,
  },
  {
    field: "product_name",
    headerName: "Nom du produit",
    renderCell: ({ value }) => value ? value : <>-----</>,
    flex: 0.5,
  },
  {
    field: "product_buy_price",
    headerName: "Prix d'achat",
    renderCell: ({ value }) => value ? value : <>-----</>,
    flex: 0.3,
  },
  {
    field: "product_sell_price",
    headerName: "Prix ​​de vente",
     renderCell: ({ value }) => value ? value : <>-----</>,
    flex: 0.3,
  },
  {
    field: "sell_qantity",
    headerName: "Quantité",
    renderCell: ({ value }) => value ? value : <>-----</>,
    flex: 0.2,
  },
  {
    field: "sell_totalprice",
    headerName: "Prix ​​Total",
    renderCell: ({ value }) => value ? value : <>-----</>,
    flex: 0.5,
  },
  {
    field: "sell_profit",
    headerName: "Profit",
    flex: 0.3,
    renderCell: ({ value }) => {
      const style = {
        color: value > 0 ? "lightgreen" : "red",
      };
      return <div style={style}>{value}</div>;
    },
  },
  {
    field: "timestamp",
    headerName: "Date",
    flex: 0.5,
    renderCell: ({ value }) => value ? new Date(value.seconds * 1000).toLocaleString() : null,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 0.5,
  },
];