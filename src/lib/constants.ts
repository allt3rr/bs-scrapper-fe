export const backendAddress = [
  {
    name: "TypeScript",
    address: process.env.NEXT_PUBLIC_FETCH_ADDRESS_TS!,
  },
  {
    name: "Python",
    address: process.env.NEXT_PUBLIC_FETCH_ADDRESS_PYTHON!,
  },
];

export const services = [{ name: "olx" }];

export const typesOLX = [
  { name: "Zlecenia dla studentów", url: "student_status" },
  { name: "Praca zdalna", url: "remote_work_possibility" },
  { name: "Praca na pełen etat", url: "fulltime" },
  { name: "Praca na niepełen etat", url: "parttime" },
  { name: "Praca dodatkowa", url: "haltime" },
  { name: "Praca sezonowa", url: "seasonal" },
];

export const cititesOLX = [
  { name: "warszawa" },
  { name: "kraków" },
  { name: "zawiercie" },
  { name: "katowice" },
];
