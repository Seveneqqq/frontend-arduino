import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import SessionTimedOut from "../sessionTimedOut";

export default function SettingTab() {
  let [data, setData] = useState(null);
  let [copyText, setCopyText] = useState("Copy");
  let [isEditing, setIsEditing] = useState(false);
  let [newName, setNewName] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const handleDeleteHome = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this home? This action cannot be undone."
      )
    ) {
      try {
        const house_id = sessionStorage.getItem("selected-home-id");
        const response = await fetch(
          `http://localhost:4000/api/home/${house_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("AuthToken"),
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          setSessionExpired(true);
          return;
        }

        if (response.ok) {
          sessionStorage.removeItem("selected-home-id");
          sessionStorage.removeItem("selected-home-name");
          navigate("/login-app-home");
        } else {
          const data = await response.json();
          alert(data.error || "Failed to delete home");
        }
      } catch (error) {
        console.error("Error deleting home:", error);
        alert("Failed to delete home");
      }
    }
  };

  const fetchHouseInfo = async () => {
    try {
      let house_id = sessionStorage.getItem("selected-home-id");
      let response = await fetch(
        `http://localhost:4000/api/home/home-info/${house_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("AuthToken"),
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setSessionExpired(true);
        return;
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHouseInfo();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(homeInfo.home_invite_code);
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyText("Failed to copy");
      setTimeout(() => setCopyText("Copy"), 2000);
    }
  };

  const startEditing = () => {
    setNewName(homeInfo.name);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      let house_id = sessionStorage.getItem("selected-home-id");
      const response = await fetch(
        `http://localhost:4000/api/home/change-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("AuthToken"),
          },
          body: JSON.stringify({
            home_id: house_id,
            name: newName,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        setSessionExpired(true);
        return;
      }

      if (response.ok) {
        setIsEditing(false);
        fetchHouseInfo();
      } else {
        console.error("Failed to update name");
      }
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  if (!data) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const homeInfo = data.find((item) => item.type === "home_info")?.data;
  const ownerInfo = data.find((item) => item.type === "owner")?.data;
  const usersInfo = data.find((item) => item.type === "users")?.data;

  if (!homeInfo || !ownerInfo || !usersInfo) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col py-5 gap-6 max-w-3xl mx-auto">
      <SessionTimedOut
        visible={sessionExpired}
        setVisible={setSessionExpired}
      />
      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Home</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Name</span>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-gray-800 text-lg px-3 py-1.5 rounded border-0 focus:ring-1 focus:ring-blue-400 outline-none"
                    />
                    <button
                      onClick={handleSave}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="pi pi-save"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg">{homeInfo.name}</span>
                    <button
                      onClick={startEditing}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="pi pi-pen-to-square"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Invite Code</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 px-3 py-1.5 rounded text-blue-400 font-mono">
                  {homeInfo.home_invite_code}
                </code>
                <button
                  onClick={handleCopy}
                  className={`text-sm ${
                    copyText === "Copied!"
                      ? "text-green-400"
                      : copyText === "Failed to copy"
                      ? "text-red-400"
                      : "text-gray-400 hover:text-white"
                  } transition-colors`}
                >
                  {copyText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Owner</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Username</span>
              <span className="text-lg">{ownerInfo.login}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Email</span>
              <span className="text-lg">{ownerInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-3">
            {usersInfo.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-lg group"
              >
                <div className="flex-1">
                  <div className="text-lg">{user.login}</div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
                {ownerInfo.id === parseInt(sessionStorage.getItem("UserId")) &&
                  user.id !== ownerInfo.id && (
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            `Are you sure you want to remove ${user.login} from this home?`
                          )
                        ) {
                          try {
                            const response = await fetch(
                              "http://localhost:4000/api/account/leave-home",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization:
                                    "Bearer " +
                                    sessionStorage.getItem("AuthToken"),
                                },
                                body: JSON.stringify({
                                  home_id: homeInfo.home_id,
                                  user_id: user.id,
                                }),
                              }
                            );

                            if (
                              response.status === 401 ||
                              response.status === 403
                            ) {
                              setSessionExpired(true);
                              return;
                            }

                            if (response.ok) {
                              fetchHouseInfo();
                            } else {
                              const data = await response.json();
                              alert(data.error || "Failed to remove user");
                            }
                          } catch (error) {
                            console.error("Error:", error);
                            alert("Failed to remove user");
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <i className="pi pi-times text-xl"></i>
                    </button>
                  )}
                {user.id === parseInt(sessionStorage.getItem("UserId")) &&
                  user.id !== ownerInfo.id && (
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to leave this home?"
                          )
                        ) {
                          try {
                            const response = await fetch(
                              "http://localhost:4000/api/account/leave-home",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization:
                                    "Bearer " +
                                    sessionStorage.getItem("AuthToken"),
                                },
                                body: JSON.stringify({
                                  home_id: homeInfo.home_id,
                                  user_id: sessionStorage.getItem("UserId"),
                                }),
                              }
                            );

                            if (
                              response.status === 401 ||
                              response.status === 403
                            ) {
                              setSessionExpired(true);
                              return;
                            }

                            if (response.ok) {
                              sessionStorage.removeItem("selected-home-id");
                              sessionStorage.removeItem("selected-home-name");
                              navigate("/login-app-home");
                            } else {
                              const data = await response.json();
                              alert(data.error || "Failed to leave home");
                            }
                          } catch (error) {
                            console.error("Error:", error);
                            alert("Failed to leave home");
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <i className="pi pi-sign-out text-xl"></i>
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {ownerInfo.id === parseInt(sessionStorage.getItem("UserId")) && (
        <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-red-900/20 p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold text-red-400">Delete Home</h3>
                  <p className="text-sm text-gray-400">
                    Once you delete a home, there is no going back. Please be
                    certain.
                  </p>
                </div>
                <button
                  onClick={handleDeleteHome}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
