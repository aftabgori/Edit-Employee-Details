import * as React from 'react';
import { sp } from "@pnp/sp/presets/all";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
// import { WebPartContext } from '@microsoft/sp-webpart-base';

const EditEmployeeDetails: React.FC = () => {
  const [employeeData, setEmployeeData] = React.useState<any>({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showButton, setShowButton] = React.useState(true);
  // const [hasSavedSuccessfully, setHasSavedSuccessfully] = React.useState(false);

  const siteUrl = "https://tuliptechcom.sharepoint.com/sites/poc";

  sp.setup({
    sp: {
      baseUrl: siteUrl
    }
  });

  const getCurrentUser = async () => {
    const response = await sp.web.currentUser.get();
    return response;
  }

  const fetchEmployeeData = async () => {
    try {
      const currentUser = await getCurrentUser();
      const email = currentUser.Email;

      const response = await sp.web.lists.getByTitle("EmployeeDetails").items
        .filter(`Official_x0020_Email_x0020_ID eq '${email}'`)
        .get();

      if (response.length === 1) {
        setEmployeeData(response[0]);
        setIsEditing(true);
        setShowButton(false);
        // setHasSavedSuccessfully(false);
        console.log(response)
      } else {
        setErrorMessage("No entry found for the logged-in user.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("An error occurred while fetching data.");
    }
  };

  const handleEditClick = () => {
    fetchEmployeeData();
  };

  const handleFieldChange = (field: string, value: string) => {
    setEmployeeData((prevData: any) => ({ ...prevData, [field]: value }));
  };

  const handleDateFieldChange = (field: string, value: string) => {
    setEmployeeData((prevData: any) => ({ ...prevData, [field]: new Date(value).toISOString() }));
  };

  const handleChoiceFieldChange = (field: string, value: string) => {
    setEmployeeData((prevData: any) => ({ ...prevData, [field]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);

    try {
      const response = await sp.web
        .lists.getByTitle("EmployeeDetails")
        .items.getById(employeeData.Id)
        .update(employeeData);

      if (response) {
        setSaveMessage("Changes saved successfully.");
        // setHasSavedSuccessfully(true);
      } else {
        setErrorMessage("An error occurred while saving changes.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("An error occurred while saving changes.");
    }

    setIsSaving(false);
  };

  return (
    <div>
      {showButton && (
        <Button variant='contained' onClick={handleEditClick}>
          Edit Your Details
        </Button>
      )}

      {isEditing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Employee Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Title || ""}
              onChange={e => handleFieldChange("Title", e.target.value)}
            />
            <TextField
              label="First Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.First_x0020_Name || ""}
              onChange={e => handleFieldChange("First_x0020_Name", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Middle Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Middle_x0020_Name || ""}
              onChange={e => handleFieldChange("Middle_x0020_Name", e.target.value)}
            />
            <TextField
              label="Last Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Last_x0020_Name || ""}
              onChange={e => handleFieldChange("Last_x0020_Name", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Date Of Joining"
              required
              style={{ width: '100%' }}
              type="date"
              value={employeeData.Date_x0020_Of_x0020_Joining ? employeeData.Date_x0020_Of_x0020_Joining.substr(0, 10) : ""}
              onChange={e => handleDateFieldChange("Date_x0020_Of_x0020_Joining", e.target.value)}
            />
            <TextField
              label="Date Of Birth"
              required
              style={{ width: '100%' }}
              type="date"
              value={employeeData.Date_x0020_of_x0020_Birth ? employeeData.Date_x0020_of_x0020_Birth.substr(0, 10) : ""}
              onChange={e => handleDateFieldChange("Date_x0020_of_x0020_Birth", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Designation"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Designation || ""}
              onChange={e => handleFieldChange("Designation", e.target.value)}
            />
            <FormControl style={{ width: '100%' }} >
              <Select
                label="Employment Type"
                required
                value={employeeData.Employment_x0020_Type || ""}
                onChange={e => handleChoiceFieldChange("Employment_x0020_Type", e.target.value)}
              >
                <MenuItem value="Full-Time">Full Time</MenuItem>
                <MenuItem value="Part-Time">Part Time</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="Freelancer">Freelancer</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Location"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Location || ""}
              onChange={e => handleFieldChange("Location", e.target.value)}
            />
            <FormControl style={{ width: '100%' }}>
              <Select
                label="Gender"
                required
                value={employeeData.Gender || ""}
                onChange={e => handleChoiceFieldChange("Gender", e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Blood Group"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Blood_x0020_Group || ""}
              onChange={e => handleFieldChange("Blood_x0020_Group", e.target.value)}
            />
            <TextField
              label="Marital Status"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Marital_x0020_Status || ""}
              onChange={e => handleFieldChange("Marital_x0020_Status", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Name of the Spouse"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Name_x0020_of_x0020_the_x0020_sp || ""}
              onChange={e => handleFieldChange("Name_x0020_of_x0020_the_x0020_sp", e.target.value)}
            />
            <TextField
              label="Name of the Child(if any)"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Name_x0020_of_x0020_child_x0028_ || ""}
              onChange={e => handleFieldChange("Name_x0020_of_x0020_child_x0028_", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Father's Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Father_x0027_s_x0020_Name || ""}
              onChange={e => handleFieldChange("Father_x0027_s_x0020_Name", e.target.value)}
            />
            <TextField
              label="Mother's Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Mother_x0027_s_x0020_Name || ""}
              onChange={e => handleFieldChange("Mother_x0027_s_x0020_Name", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Personal Mobile Number"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Personal_x0020_Mobile_x0020_Numb || ""}
              onChange={e => handleFieldChange("Personal_x0020_Mobile_x0020_Numb", e.target.value)}
            />
            <TextField
              label="Emergency Contact Person Name"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Emergency_x0020_Contact_x0020_Pe || ""}
              onChange={e => handleFieldChange("Emergency_x0020_Contact_x0020_Pe", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Emergency Contact Person Relation"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Emergency_x0020_Contact_x0020_Pe0 || ""}
              onChange={e => handleFieldChange("Emergency_x0020_Contact_x0020_Pe0", e.target.value)}
            />
            <TextField
              label="Official Mobile Number"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Official_x0020_Mobile_x0020_Numb || ""}
              onChange={e => handleFieldChange("Official_x0020_Mobile_x0020_Numb", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Emergency Contact Person Number"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Emergency_x0020_Contact_x0020_Pe1 || ""}
              onChange={e => handleFieldChange("Emergency_x0020_Contact_x0020_Pe1", e.target.value)}
            />
            <TextField
              label="Personal Email ID"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Personal_x0020_Email_x0020_ID || ""}
              onChange={e => handleFieldChange("Personal_x0020_Email_x0020_ID", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Official Email ID"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Official_x0020_Email_x0020_ID || ""}
              onChange={e => handleFieldChange("Official_x0020_Email_x0020_ID", e.target.value)}
            />
            <TextField
              label="Permanent Address"
              required
              style={{ width: '100%' }}
              multiline
              value={employeeData.Permanent_x0020_Address || ""}
              onChange={e => handleFieldChange("Permanent_x0020_Address", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Pincode/Zipcode"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Pincode_x002f_Zipcode || ""}
              onChange={e => handleFieldChange("Pincode_x002f_Zipcode", e.target.value)}
            />
            <TextField
              label="Photo ID"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Photo_x0020_ID || ""}
              onChange={e => handleFieldChange("Photo_x0020_ID", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Photo ID Number"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Photo_x0020_ID_x0020_Number || ""}
              onChange={e => handleFieldChange("Photo_x0020_ID_x0020_Number", e.target.value)}
            />
            <TextField
              label="Nationality"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Nationality || ""}
              onChange={e => handleFieldChange("Nationality", e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Email Address"
              required
              style={{ width: '100%' }}
              type="text"
              value={employeeData.Email_x0020_Address || ""}
              onChange={e => handleFieldChange("Email_x0020_Address", e.target.value)}
            />
          </div>
          <div style={{ alignSelf: 'center' }}>
            <Button
              style={{ width: '200px', height: '50px' }}
              variant='contained'
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <div>
              <p>{saveMessage}</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default EditEmployeeDetails;
