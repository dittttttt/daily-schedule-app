import React, { useState } from "react";

function ScheduleApp() {
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedName, setEditedActivity] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  //date
  const date = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  //tambah data
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  //edit data
  const editItem = (index, updatedItem) => {
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    // updatedItems[1];
    setItems(
      updatedItems.map((e) => (e?.id === index ? { ...updatedItem } : e))
    );
    setEditIndex(null); // Ini buat exit (Edit Mode)
    setEditedActivity(""); // Reset nilai editedName setelah selesai mengedit
    setEditedTime(""); // Reset nilai editedTime setelah selesai mengedit
  };

  //checkbox
  const Checklist = (index) => {
    console.log("index ", index);
    const updatedItems = [...items];
    // updatedItems[index].completed = !updatedItems[index].completed;
    setItems(
      updatedItems.map((e) =>
        e?.id === index ? { ...e, completed: !e?.completed } : e
      )
    );
  };

  //Search
  const SearchForm = (e) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);
  };

  //Mengurutkan data berdasarkan waktu
  const sortedItems = [...items].sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  // hapus data
  const removeItem = (index) => {
    setEditIndex(null);
    setItems(items.filter((item, i) => item?.id !== index));
  };

  //delete done activity
  const deleteDoneActivity = () => {
    if (items.length === 0) {
      alert("Aktifitas masih kosong, ayok kita isi");
      return;
    }

    if (
      window.confirm(
        "Apakah kamu yakin menghapus aktifitas yang sudah selesai?"
      )
    ) {
      setItems(items.filter((item) => !item.completed));
    }
  };

  //Hapus Semua Data
  const deleteAll = () => {
    if (items.length === 0) {
      alert("Aktifitas masih kosong, ayok kita isi");
      return;
    }

    if (window.confirm("Apakah kamu yakin menghapus semua aktifitas?")) {
      setItems([]);
    }
  };

  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="p-5 border ">
        {/* Main Tittle */}
        <p className="text-center text-2xl py-2">
          <strong>Daily Schedule App</strong>
        </p>
        {/* date */}
        <p className="text-center pb-5">{date()}</p>
        {/* Add Activity */}
        <div className="p-5 border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newActivityName = e.target.activityName.value.trim();
              const newActivityTime = e.target.activityTime.value.trim();

              //kondisi activity kosong
              if (newActivityName === "")
                return alert("Upss... Kamu mau aktifitas apa hari ini?");

              //kondisi waktu kosong
              if (newActivityTime === "")
                return alert("Upss... Kamu mau aktifitas itu jam berapa?");

              //memanggil function additem()
              addItem({
                id: Date.now(),
                name: newActivityName,
                time: newActivityTime,
                completed: false,
              });

              //reset form input
              e.target.reset();
            }}
          >
            {/* Input data */}
            <div className="flex">
              <input
                className="border p-2 me-2 rounded-md"
                type="time"
                name="activityTime"
              />
              <input
                className="w-3/4 border p-2  rounded-md"
                type="text"
                name="activityName"
                placeholder="Your Activity Today"
              />
            </div>
            <button
              className="bg-green-500 w-full p-2 mt-4 rounded-md text-white hover:bg-green-600
             "
              type="submit"
            >
              New Activity
            </button>
          </form>
        </div>
        {/* Sub Tittle */}
        <p className="text-center p-5 mt-5 text-xl">
          <strong>My Activity</strong>
        </p>
        {/* Filter Button */}
        <div className="flex mb-5">
          <button
            className={`bg-blue-500 w-2/5 p-2 rounded-md text-white hover:bg-blue-600 ${
              filter === "all" ? "bg-blue-600 underline" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`bg-blue-500 w-2/5 p-2 mx-2  rounded-md text-white hover:bg-blue-600 ${
              filter === "todo" ? "bg-blue-600 underline" : ""
            }`}
            onClick={() => setFilter("todo")}
          >
            ToDo
          </button>
          <button
            className={`bg-blue-500 w-2/5 p-2 rounded-md text-white hover:bg-blue-600 ${
              filter === "done" ? "bg-blue-600 underline" : ""
            }`}
            onClick={() => setFilter("done")}
          >
            Done
          </button>
        </div>
        {/* Search */}
        <div className="flex justify-end mb-5 ">
          <input
            className="border p-2 rounded-md"
            type="text"
            name="activityTime"
            placeholder="Search"
            value={searchTerm}
            onChange={SearchForm}
          />
        </div>
        {/* Show Data */}
        <table className="w-full border">
          <thead className="border">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Activity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {sortedItems
              // filter button
              .filter((item) => {
                if (filter === "done") return item.completed;
                if (filter === "todo") return !item.completed;
                return true;
              })
              //filter search
              .filter((item) => {
                return item.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              })
              .map((item) => {
                return (
                  <tr
                    key={item.id}
                    className={`border-b ${
                      item.completed ? "line-through text-red-400" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => Checklist(item?.id)}
                      />
                    </td>
                    <td>
                      {editIndex === item?.id ? (
                        <input
                          type="time"
                          value={editedTime}
                          onChange={(e) => setEditedTime(e.target.value)}
                          className="rounded-md px-3 py-2"
                        />
                      ) : (
                        <span>{item.time}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editIndex === item?.id ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedActivity(e.target.value)}
                          className="rounded-md px-3 py-2"
                        />
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editIndex === item?.id ? (
                        <button
                          onClick={() => {
                            const editName = editedName.trim();
                            const editTime = editedTime.trim();
                            if (editName === "")
                              return alert(
                                "Upss... Kamu mau melakukan aktivitas apa?"
                              );
                            if (editTime === "")
                              return alert("Upss... Yuk atur waktunya");
                            editItem(item?.id, {
                              ...item,
                              name: editName,
                              time: editTime,
                            });
                            setEditedActivity(""); //Reset activity
                            setEditedTime(""); //reset time
                          }}
                          className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditIndex(item?.id);
                              setEditedActivity(item.name);
                              setEditedTime(item.time);
                            }}
                            className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeItem(item?.id)}
                            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* Button Delete */}
        <div>
          <button
            onClick={deleteDoneActivity}
            className="p-2 bg-red-500 rounded-md m-5 text-white hover:bg-red-600"
          >
            Delete Done Activity
          </button>
          <button
            onClick={deleteAll}
            className="p-2 bg-red-500 rounded-md m-5 text-white hover:bg-red-600"
          >
            Delete All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
export default ScheduleApp;
