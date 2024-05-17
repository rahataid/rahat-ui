# RahatUI

RahatUi serves as the Frontend Services for the Rahat project. It comprises the following components:

- **rahat-ui**: The primary UI component utilized by Admins for managing the Rahat project.
- **community-tool-ui**: The UI component designed for the community Admins to oversee beneficiary management, offering a comprehensive toolset for effective management.

## Getting Started

To initiate the project locally, proceed with the following steps:

### Clone the Repository

```bash
git clone git@github.com:rahataid/rahat-ui.git
```

### Install Dependencies

Execute the following command to install the necessary dependencies:

```bash
pnpm i
```

### Configure Environment Variables

Copy the `.env.example` file to `.env` and adjust the environment variables according to your requirements:

```bash
cp .env.example .env
```

### Start the Development Server

This repository contains two distinct frontend applications. Start the development server for each application using the following commands:

**rahat-ui**

```bash
nx serve rahat-ui
```

**community-tool-ui**

```bash
nx serve community-tool-ui
```
