import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Item, useInvoiceContext } from "../context/invoice_context";
import { Invoice } from "../context/invoice_context";
import { createId, formatDate } from "../helpers";


const NewInvoiceModal = (props: any) => {
  const {
    toggleNewInvoiceModal,
    isNewInvoiceOpen,
    addInvoice,
    single_invoice,
    editInvoice,
  } = useInvoiceContext()!;

  let { isEdit } = props;


  const formRef = useRef<HTMLFormElement>(null);

  const [result, setResult] = useState<Invoice>(() => {
    if (isEdit) {
      return single_invoice;
    } else
      return {
        id: "",
        createdAt: formatDate(new Date().toDateString()),
        paymentDue: "",
        description: "",
        paymentTerms: 0,
        clientName: "",
        clientEmail: "",
        status: "pending",
        senderAddress: {
          street: "",
          city: "",
          postCode: "",
          country: "",
        },
        clientAddress: {
          street: "",
          city: "",
          postCode: "",
          country: "",
        },
        items: [
          {
            itemId: Math.floor(1000 + Math.random() * 9000),
            name: "",
            quantity: 0,
            price: 0,
            total: 0,
          },
        ],
        total: 0,
      };
  });
  // Close the modal when press 'Esc' OR outside the modal ==============================
  const modalRef = useRef();
  const closeModal = (e: any) => {
    if (modalRef.current === e.target) {
      toggleNewInvoiceModal();
    }
  };
  const keyEsc = useCallback(
    (e: any) => {
      if (e.key === "Escape" && isNewInvoiceOpen) {
        toggleNewInvoiceModal();
      }
    },
    // eslint-disable-next-line
    [isNewInvoiceOpen]
  );
  useEffect(() => {
    document.addEventListener("keydown", keyEsc);
    return () => document.removeEventListener("keydown", keyEsc);
  }, [keyEsc]);
  //CREATES THE INVOICE ID ===========================================
  useEffect(() => {
    if (!isEdit) {
      let generateId = createId();
      setResult({ ...result, id: generateId });
    }
    // eslint-disable-next-line
  }, []);

  //ITEMS FUCNTION ==================================================================

  const handleItemOnChange = (e: any) => {
    //THE ID  = index of the elemnt in items array
    const id: any = e.target.parentNode.parentNode.id;
    //GET THE RIGHT ITEM BY ID
    let selectedItem: Item = result.items[id];

    selectedItem = { ...selectedItem, [e.target.name]: e.target.value };
    let totalItem = selectedItem.price * selectedItem.quantity;
    selectedItem = { ...selectedItem, total: totalItem };

    let newItemList = [...result.items];
    newItemList[id] = selectedItem;
    setResult({ ...result, items: newItemList });
  };
  const addNewItem = (e: { preventDefault: () => void }) => {
    // e.preventDefault();
    let newItem = {
      itemId: Math.floor(1000 + Math.random() * 9000),
      name: "",
      quantity: 0,
      price: 0,
      total: 0,
    };
    setResult({ ...result, items: [...result.items, newItem] });
  };

  const deleteItem = (id: number) => {
    let deleteItemList = result.items.filter((item) => item.itemId !== id);
    setResult({ ...result, items: deleteItemList });
  };

  const handleOnChange = (e: any) => {
    if (e.target.name.includes("sender")) {
      if (e.target.name.includes("City")) {
        setResult({
          ...result,
          senderAddress: { ...result.senderAddress, city: e.target.value },
        });
      }
      if (e.target.name.includes("Street")) {
        setResult({
          ...result,
          senderAddress: { ...result.senderAddress, street: e.target.value },
        });
      }
      if (e.target.name.includes("Postcode")) {
        setResult({
          ...result,
          senderAddress: {
            ...result.senderAddress,
            postCode: e.target.value,
          },
        });
      }
      if (e.target.name.includes("Country")) {
        setResult({
          ...result,
          senderAddress: { ...result.senderAddress, country: e.target.value },
        });
      }
    } else if (e.target.name.includes("receiver")) {
      if (e.target.name.includes("City")) {
        setResult({
          ...result,
          clientAddress: { ...result.clientAddress, city: e.target.value },
        });
      }
      if (e.target.name.includes("Street")) {
        setResult({
          ...result,
          clientAddress: { ...result.clientAddress, street: e.target.value },
        });
      }
      if (e.target.name.includes("Postcode")) {
        setResult({
          ...result,
          clientAddress: {
            ...result.clientAddress,
            postCode: e.target.value,
          },
        });
      }
      if (e.target.name.includes("Country")) {
        setResult({
          ...result,
          clientAddress: { ...result.clientAddress, country: e.target.value },
        });
      }
    } else {
      setResult({ ...result, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (action: "ADD" | "DRAFT" | "EDIT", e?: any) => {
    if (e) e.preventDefault();
    let isValidated = validate(); //if validate pass the validation return true

    if (isValidated) {
      switch (action) {
        case "ADD":
          addInvoice(result, false);
          break;

        case "DRAFT":
          addInvoice(result, true);
          break;
        case "EDIT":
          editInvoice(result, single_invoice._id);

          break;
      }
      toggleNewInvoiceModal();
    }
  };

  const validate = () => {
    let isformCompleted = true;
    const form: any = formRef.current;
    let formElements = form.elements;
    formElements = [...formElements]; //transform the html collection in an array
    formElements = formElements.filter((item: any) => {
      //keep only the input node
      return item.nodeName === "INPUT";
    });
    //remove the invalid-input class when you try to submit the seccond time
    formElements.forEach((item: any) => {
      item.classList.remove("invalid-input");
    });
    formElements.forEach((item: any) => {
      //check if input is empty and/or has dataset of required(not the default "required"attribute )
      if (!item.value && item.dataset.required === "true") {
        item.classList.add("invalid-input");
        isformCompleted = false;
      }
    });
    return isformCompleted;
  };

  return (
    <div className="modal-bg" ref={modalRef} onClick={closeModal}>
      <div className="newInvoice-modal">
        <div className="go-back-container" onClick={toggleNewInvoiceModal}>
          <img src="/assets/icon-arrow-left.svg" alt=""></img>
          <h4>Go Back</h4>
        </div>

        <form ref={formRef}>
          <h1>{isEdit ? `Edit  #${result.id}` : "New Invoice"}</h1>
          <h4>Bill from</h4>
          {/* SENDER ================= */}
          <label htmlFor="senderStreet" className="p-gray">
            Street Address
          </label>
          <input
            className="input-long"
            type="text"
            name="senderStreet"
            value={result.senderAddress.street}
            onChange={handleOnChange}
            placeholder="19 Union Terrace"
          />
          {/* SENDER CITY,POSTCODE,COUNTRY ================== */}

          <div className="city-postcode-country">
            <div className="form-line">
              <label htmlFor="senderCity" className="p-gray">
                City
              </label>
              <input
                className="input-short"
                type="text"
                name="senderCity"
                value={result.senderAddress.city}
                onChange={handleOnChange}
                placeholder="London"
              />
            </div>
            <div className="form-line">
              <label htmlFor="senderPostcode" className="p-gray">
                Post Code
              </label>
              <input
                className="input-short"
                type="text"
                name="senderPostcode"
                value={result.senderAddress.postCode}
                onChange={handleOnChange}
                placeholder="E13EZ"
              />
            </div>
            <div className="form-line country">
              <label htmlFor="senderCoutry" className="p-gray">
                Country
              </label>
              <input
                className="input-short"
                type="text"
                name="senderCountry"
                value={result.senderAddress.country}
                onChange={handleOnChange}
                placeholder="United Kingdom"
              />
            </div>
          </div>

          {/* CLIENT ================== */}
          <h4>Bill To</h4>
          {/* CLIENT NAME ================== */}

          <label htmlFor="clientName" className="p-gray">
            Client's Name
          </label>
          <input
            className="input-long"
            type="text"
            name="clientName"
            value={result.clientName}
            onChange={handleOnChange}
            placeholder="Alex Grinn"
            data-required="true"
          />
          {/* CLIENT EMAIL ================== */}

          <label htmlFor="clientEmail" className="p-gray">
            Client's Email
          </label>
          <input
            className="input-long"
            type="email"
            name="clientEmail"
            value={result.clientEmail}
            onChange={handleOnChange}
            placeholder="alexgrim@mail.com"
            data-required="true"
          />
          {/* CLIENT STREET ================== */}

          <label htmlFor="receiverStreet" className="p-gray">
            Client's Street
          </label>
          <input
            className="input-long"
            type="text"
            name="receiverStreet"
            value={result.clientAddress.street}
            onChange={handleOnChange}
            placeholder="84 Church Way"
          />
          {/*CLIENT CITY,POSTCODE,COUNTRY ================== */}
          <div className="city-postcode-country">
            <div className="form-line">
              <label htmlFor="receiverCity" className="p-gray">
                City
              </label>
              <input
                className="input-short"
                type="text"
                name="receiverCity"
                value={result.clientAddress.city}
                onChange={handleOnChange}
                placeholder="Bradford"
              />
            </div>
            <div className="form-line">
              <label htmlFor="receiverPostcode" className="p-gray">
                Post Code
              </label>
              <input
                className="input-short"
                type="text"
                name="receiverPostcode"
                value={result.clientAddress.postCode}
                onChange={handleOnChange}
                placeholder="BD1 9PB"
              />
            </div>
            <div className="form-line country">
              <label htmlFor="receiverCountry" className="p-gray">
                Country
              </label>
              <input
                className="input-short"
                type="text"
                name="receiverCountry"
                value={result.clientAddress.country}
                onChange={handleOnChange}
                placeholder="United Kingdom"
              />
            </div>
          </div>
          {/* INVOICE DATE ================== */}

          <label htmlFor="invoiceDate" className="p-gray">
            Invoice Date
          </label>
          <input
            className="input-long"
            type="date"
            name="paymentDue"
            value={result.paymentDue}
            onChange={handleOnChange}
            data-required="true"
          />

          {/* PAYMENT TERMS ================== */}

          <label htmlFor="paymentTerms" className="p-gray">
            Payment Terms
          </label>
          <select
            id="paymentTerms"
            name="paymentTerms"
            onChange={handleOnChange}
            data-required="true"
          >
            <option value="1">Net 1 day</option>
            <option value="7">Net 7 day</option>
            <option value="14">Net 14 day</option>
            <option value="30">Net 30 day</option>
          </select>

          {/* PAYMENT TERMS ================== */}

          <label htmlFor="projectDesciption" className="p-gray">
            Project Desciption
          </label>
          <input
            className="input-long"
            type="text"
            name="description"
            value={result.description}
            onChange={handleOnChange}
            placeholder="Graphic design"
          />
          {/* ITEM LIST ========================== */}

          <div className="item-list">
            <h2>Item List</h2>

            {result.items.map((item, i) => (
              <div className="item" key={i} id={i.toString()}>
                {/* ITEM NAME */}
                <div className="item-name">
                  <label htmlFor="name" className="p-gray">
                    Item Name
                  </label>
                  <input
                    className="input-long"
                    type="text"
                    name="name"
                    value={result.items[i].name}
                    onChange={handleItemOnChange}
                    placeholder="Item Name"
                    data-required="true"
                  />
                </div>
                {/* ITEM QUANTITY */}
                <div className="item-qty">
                  <label htmlFor="quantity" className="p-gray">
                    Qty.
                  </label>
                  <input
                    className="input-long"
                    type="text"
                    name="quantity"
                    value={result.items[i].quantity}
                    onChange={handleItemOnChange}
                    placeholder="1"
                  />
                </div>
                {/* ITEM PRICE */}
                <div className="item-price-form">
                  <label htmlFor="price" className="p-gray">
                    Price
                  </label>
                  <input
                    className="input-long"
                    type="number"
                    name="price"
                    value={result.items[i].price}
                    onChange={handleItemOnChange}
                    placeholder="0.00"
                  />
                </div>
                {/* ITEM TOTAL */}
                <div className="item-total-form">
                  <label htmlFor="total" className="p-gray">
                    Total
                  </label>
                  <input
                    className="input-long"
                    type="number"
                    name="total"
                    value={result.items[i].total}
                    onChange={handleItemOnChange}
                    placeholder="0.00"
                    readOnly
                  />
                </div>
                <div
                  className="delete-btn"
                  onClick={(e) => deleteItem(item.itemId)}
                >
                  <svg
                    width="13"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                      
                      fill-rule="nonzero"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn addItem-btn"
            type="button"
            onClick={addNewItem}
          >
            + Add New Item
          </button>
          {isEdit ? (
            <div className="invoiceDetails-btns modal-btn">
              <button
                className="btn secondary-btn"
                type="button"
                onClick={toggleNewInvoiceModal}
              >
                Cancel
              </button>

              <button
                className="btn purple-btn"
                name="send"
                type="button"
                onClick={() => handleSubmit("EDIT")}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="invoiceDetails-btns modal-btn">
              <button
                className="btn secondary-btn"
                type="button"
                onClick={toggleNewInvoiceModal}
              >
                Discard
              </button>
              <button
                className="btn dark-btn"
                name="sendAsDraft"
                type="button"
                onClick={() => handleSubmit("DRAFT")}
              >
                Save as Draft
              </button>
              <button
                className="btn purple-btn"
                name="send"
                type="button"
                onClick={() => handleSubmit("ADD")}
              >
                Save &amp; Send
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewInvoiceModal;
