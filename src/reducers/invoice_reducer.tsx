import { Invoice } from "../context/invoice_context";

const invoice_reducer = (state: any, action: { type: any; payload?: any }) => {
  const { type, payload } = action;

  switch (type) {
    case "TOGGLE_THEME": {
       if (state.isDark) {
         document.body.classList.add("dark-theme");
       } else {
         document.body.classList.remove("dark-theme");
       }

      return { ...state, isDark: !state.isDark };
    }
    case "FETCH_INVOICES_START": {
      return { ...state, isInvoicesLoading: true };
    }
    case "FETCH_INVOICES_COMPLETED": {

      return { ...state, isInvoicesLoading: false, invoices: action.payload };
    }
    case "FETCH_INVOICES_ERROR": {
      return { ...state };
    }
    case "ADD_INVOICE_COMPLETED": {
      const newInvoice = action.payload;
      return { ...state, invoices: [...state.invoices, newInvoice] };
    }
    case "DELETE_INVOICE_COMPLETED": {
      let newInvoiceList = state.invoices.filter((item: any) => {
        return item._id !== action.payload;
      });

      return { ...state, invoices: newInvoiceList };
    }
    case "DELETE_INVOICE_ERROR": {
      console.log("error");

      return { ...state };
    }

    case "UPDATE_FILTER": {
      let newvalue = !state.filter[payload];
      return { ...state, filter: { ...state.filter, [payload]: newvalue } };
    }
    case "GET_FILTERED_INVOICES": {
      const totalInvoices = state.invoices;
      const { paid, pending, draft } = state.filter;
      let paidTemp = "";
      let draftTemp = "";
      let pendingTemp = "";
      let filteredInvoices = totalInvoices.filter((invoice: Invoice) => {
        if (paid) paidTemp = "paid";
        if (pending) pendingTemp = "pending";
        if (draft) draftTemp = "draft";
        return (
          invoice.status === paidTemp ||
          invoice.status === pendingTemp ||
          invoice.status === draftTemp
        );
      });
      let sortedByDate = filteredInvoices.sort(function (
        date1: any,
        date2: any
      ) {
        date1 = new Date(date1.paymentDue);
        date2 = new Date(date2.paymentDue);
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 1;
      });
      
      return { ...state, filtered_invoices: sortedByDate };
    }
    case "GET_SINGLE_INVOICE": {
      let { id } = payload;
      let singleInvoice = state.invoices.find((item: Invoice) => {
        return item.id === id;
      });
      return { ...state, single_invoice: singleInvoice };
    }
    case "GET_TOTAL_INVOICES": {
      let totalInvoices = state.invoices.length;
      return { ...state, total_invoices: totalInvoices };
    }
    case "TOGGLE_NEW_INVOICE_MODAL": {
      return { ...state, isNewInvoiceOpen: !state.isNewInvoiceOpen };
    }
    case "TOGGLE_EDIT_INVOICE_MODAL": {
      return { ...state, isNewInvoiceOpen: !state.isNewInvoiceOpen };
    }
    case "HANDLE_SUBMIT": {
      console.log(action.payload);

      return { ...state, invoices: [...state.invoices, action.payload] };
    }
    case "UPDATE_INVOICE_COMPLETED": {
      const { newStatus } = action.payload;

      return {
        ...state,
        single_invoice: { ...state.single_invoice, status: newStatus },
      };
    }
    case "EDIT_INVOICE_COMPLETED": {
      const {invoice} = action.payload;
      return { ...state, single_invoice: invoice };
    }
    case "EDIT_INVOICE_ERROR": {
      
      return { ...state };
    }
  }

  throw new Error(`No Matching "${action.type}" - action type`);

 
};

export default invoice_reducer;
