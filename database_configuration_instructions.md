# Agentic System Database Configuration Instructions

## Introduction

This document provides detailed instructions for setting up the database configuration as the second task of Phase 1 (Foundation and Infrastructure Setup) of the Agentic System Pre-Production Roadmap (`pre_production_roadmap.md`). As outlined in the Phase 1 Infrastructure Setup Plan (`phase1_infrastructure_setup.md`), this task focuses on implementing relational and NoSQL databases to support data storage needs, ensuring data consistency and security for the Agentic System. The setup is critical to meet the data layer requirements (SWREQ-DL-STORE-001, SWREQ-DL-ENC-001) and must be completed within Week 2 of the 4-week Phase 1 timeline.

## Objectives

- Select appropriate database technologies for relational and NoSQL data storage needs.
- Provision database instances using managed services for reduced administrative overhead.
- Configure database security with encryption at rest and in transit to protect sensitive data.
- Set up access control mechanisms to ensure only authorized services interact with databases.
- Initialize database schemas and collections for storing system data.
- Configure automated backups to ensure data durability and recovery capabilities.

## Timeline

- **Duration**: 1 week (Week 2 of Phase 1)
- **Start Date**: Immediately following completion of Task 1 (Cloud Environment Setup)
- **End Date**: End of Week 2

## Prerequisites

- Completion of Task 1: Cloud Environment Setup, with a configured Virtual Private Cloud (VPC), subnets for development, testing, and staging environments, and access to compute resources.
- Approval of the Phase 1 Infrastructure Setup Plan (`phase1_infrastructure_setup.md`).
- Availability of a cloud provider account with sufficient permissions to create and manage database resources.
- Budget allocation for database service usage during the pre-production phase.
- Team members with expertise in database administration and cloud infrastructure.
- Access to necessary tools and documentation for database setup and security configurations.

## Step-by-Step Instructions

### Step 1: Select Database Technologies
**Objective**: Choose suitable database technologies for relational and NoSQL data storage to meet the diverse needs of the Agentic System.

- **Action**: Evaluate and select database technologies based on the following criteria:
  - **Relational Database**: Select PostgreSQL for structured data such as user information, project details, and ASPICE compliance records due to its robust support for complex queries, transactions, and data integrity.
  - **NoSQL Database**: Choose MongoDB for flexible, document-based storage suitable for agent interaction logs, knowledge base content, and unstructured data due to its scalability and ease of schema evolution.
  - **Compatibility**: Ensure compatibility with the chosen cloud provider's managed database services to leverage automated backups, scaling, and maintenance features.
  - **Community and Support**: Opt for technologies with strong community support and extensive documentation to aid troubleshooting and optimization.
- **Decision**: Document the chosen technologies and rationale in a decision log for team reference. For example, select PostgreSQL for relational data and MongoDB for NoSQL data based on the above criteria.
- **Responsible**: Database Administrator / Infrastructure Lead
- **Output**: Decision log entry specifying the selected database technologies (e.g., PostgreSQL and MongoDB).

### Step 2: Provision Database Instances
**Objective**: Use managed database services to provision instances for both relational and NoSQL databases, reducing administrative overhead and ensuring scalability.

- **Action**:
  1. Log in to the cloud provider's management console (e.g., AWS Management Console, assuming AWS was selected in Task 1).
  2. Navigate to the managed database service section (e.g., AWS RDS for relational databases and a service like MongoDB Atlas for NoSQL, which can be integrated with AWS or used standalone).
  3. Create a PostgreSQL instance using AWS RDS:
     - Select PostgreSQL as the engine type.
     - Choose a suitable instance size (e.g., db.t3.micro for development with 2 vCPUs and 0.5 GB RAM, scalable later).
     - Assign the instance to the development subnet within the VPC created in Task 1 for security isolation.
     - Configure storage (e.g., 20 GB initially with auto-scaling enabled) to accommodate growth.
     - Set database name, username, and password for initial access.
  4. Create a MongoDB instance using MongoDB Atlas (or AWS DocumentDB if preferring a fully AWS solution):
     - Sign up or log in to MongoDB Atlas and connect it to the AWS VPC via VPC peering or private endpoints if needed.
     - Select a cluster tier (e.g., M0 Sandbox for free tier development or M10 for dedicated resources).
     - Configure storage and backup options as per project needs.
  5. Provision additional instances or clusters for testing and staging environments, mirroring the development setup but in their respective subnets.
  6. Optionally, use Infrastructure as Code (IaC) tools like Terraform to script the database provisioning for repeatability. Example Terraform script for AWS RDS PostgreSQL:
     ```hcl
     resource "aws_db_instance" "agentic_postgres_dev" {
       allocated_storage    = 20
       storage_type         = "gp2"
       engine               = "postgres"
       engine_version       = "13.7"
       instance_class       = "db.t3.micro"
       name                 = "agenticdev"
       username             = "admin"
       password             = "securepassword123" # Use secrets management in production
       parameter_group_name = "default.postgres13"
       vpc_security_group_ids = [aws_security_group.db_sg.id]
       db_subnet_group_name = aws_db_subnet_group.dev_subnet_group.name
       tags = {
         Name = "AgenticPostgresDev"
       }
     }
     
     resource "aws_db_subnet_group" "dev_subnet_group" {
       name       = "agentic-dev-subnet-group"
       subnet_ids = [aws_subnet.dev_subnet.id]
       tags = {
         Name = "AgenticDevSubnetGroup"
       }
     }
     
     resource "aws_security_group" "db_sg" {
       vpc_id = aws_vpc.agentic_vpc.id
       ingress {
         from_port   = 5432
         to_port     = 5432
         protocol    = "tcp"
         cidr_blocks = ["10.0.0.0/16"] # Restrict to VPC
       }
       egress {
         from_port   = 0
         to_port     = 0
         protocol    = "-1"
         cidr_blocks = ["0.0.0.0/0"]
       }
       tags = {
         Name = "AgenticDBSecurityGroup"
       }
     }
     ```
- **Responsible**: Database Administrator / DevOps Engineer
- **Output**: Provisioned PostgreSQL and MongoDB instances for development, testing, and staging environments, with configurations documented or scripted via IaC.

### Step 3: Configure Database Security
**Objective**: Enable encryption at rest and in transit to protect sensitive data stored in the databases (SWREQ-DL-ENC-001).

- **Action**:
  1. For PostgreSQL on AWS RDS:
     - During instance creation or via modification, enable encryption at rest using AWS Key Management Service (KMS). Select a KMS key (or use the default RDS key) to encrypt storage.
     - Ensure SSL/TLS is enabled for connections by verifying the instance parameter group has `rds.force_ssl` set to `1`. Download the SSL certificate from AWS documentation for client connections.
  2. For MongoDB Atlas:
     - Encryption at rest is enabled by default using the cloud provider's storage encryption (integrated with AWS KMS if on AWS). Verify this in the Atlas security settings.
     - Enable TLS for connections by default (Atlas enforces TLS/SSL for all connections). Obtain the connection string with TLS enabled from the Atlas dashboard.
  3. Test encrypted connections from a client or compute instance in the VPC to ensure data in transit is secure (e.g., use `psql` with SSL for PostgreSQL or MongoDB shell with TLS).
  4. Document the encryption settings and connection methods for team reference, including how to obtain and use SSL/TLS certificates for client applications.
- **Responsible**: Security Engineer / Database Administrator
- **Output**: Databases configured with encryption at rest and in transit, with connection security verified and documented.

### Step 4: Set Up Access Control
**Objective**: Implement database-specific access controls and integrate with IAM for role-based access, ensuring only authorized services can interact with databases (SWREQ-DL-ACC-001).

- **Action**:
  1. For PostgreSQL on AWS RDS:
     - Use the database username and password set during instance creation for initial access, but restrict to specific IP ranges via the security group (e.g., only from VPC subnets).
     - Integrate with AWS IAM for database authentication by enabling IAM database authentication in RDS settings. Create IAM policies and roles for services or users needing access.
     - Example IAM policy for RDS access:
       ```json
       {
         "Version": "2012-10-17",
         "Statement": [
           {
             "Effect": "Allow",
             "Action": [
               "rds-db:connect"
             ],
             "Resource": [
               "arn:aws:rds-db:us-west-2:account-id:dbuser:agentic_postgres_dev/agenticuser"
             ]
           }
         ]
       }
       ```
  2. For MongoDB Atlas:
     - Configure database users in the Atlas dashboard with specific roles (e.g., readWrite for application access, readOnly for reporting tools).
     - Set up IP access lists to restrict connections to the VPC CIDR block (e.g., 10.0.0.0/16) or specific compute instance IPs.
     - Optionally, integrate with AWS IAM if using Atlas with AWS for authentication via MongoDB Atlas API keys or federation.
  3. Test access controls by attempting connections from authorized and unauthorized sources to ensure restrictions are enforced.
  4. Document access control configurations, including usernames, roles, and IP restrictions, for team reference and audit purposes.
- **Responsible**: Security Engineer / Database Administrator
- **Output**: Configured access controls for both databases, integrated with IAM where applicable, with test results and documentation.

### Step 5: Initialize Database Schemas
**Objective**: Create initial schemas for PostgreSQL to store structured data and define collections in MongoDB for flexible storage, preparing the databases for application use.

- **Action**:
  1. For PostgreSQL:
     - Connect to the development instance using a tool like `psql` or pgAdmin with the admin credentials and SSL certificate if required.
     - Create a database named `agentic_system` if not already set during instance creation.
     - Define initial schemas for key data entities such as users, projects, and ASPICE compliance records. Example SQL for schema creation:
       ```sql
       CREATE DATABASE agentic_system;
       \c agentic_system
       
       CREATE TABLE users (
           id SERIAL PRIMARY KEY,
           username VARCHAR(50) UNIQUE NOT NULL,
           email VARCHAR(100) UNIQUE NOT NULL,
           password_hash VARCHAR(255) NOT NULL,
           role VARCHAR(20) NOT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
       
       CREATE TABLE projects (
           id SERIAL PRIMARY KEY,
           name VARCHAR(100) NOT NULL,
           description TEXT,
           owner_id INTEGER REFERENCES users(id),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
       
       CREATE TABLE aspice_compliance (
           id SERIAL PRIMARY KEY,
           project_id INTEGER REFERENCES projects(id),
           process_id VARCHAR(20) NOT NULL,
           status VARCHAR(20) NOT NULL,
           last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
       ```
  2. For MongoDB Atlas:
     - Connect to the development cluster using the MongoDB shell or a GUI tool like MongoDB Compass with the provided connection string.
     - Create a database named `agentic_data` and define initial collections for agent logs and knowledge base content. Example MongoDB shell commands:
       ```javascript
       use agentic_data
       
       db.createCollection("agent_logs", {
           validator: {
               $jsonSchema: {
                   bsonType: "object",
                   required: ["agent_id", "timestamp", "action"],
                   properties: {
                       agent_id: { bsonType: "string" },
                       timestamp: { bsonType: "date" },
                       action: { bsonType: "string" },
                       details: { bsonType: "object" }
                   }
               }
           }
       });
       
       db.createCollection("knowledge_base", {
           validator: {
               $jsonSchema: {
                   bsonType: "object",
                   required: ["category", "title", "content"],
                   properties: {
                       category: { bsonType: "string" },
                       title: { bsonType: "string" },
                       content: { bsonType: "string" },
                       tags: { bsonType: "array" },
                       created_at: { bsonType: "date" }
                   }
               }
           }
       });
       ```
  3. Populate initial test data in both databases to verify schema/collection structures (e.g., insert a test user in PostgreSQL, a test log entry in MongoDB).
  4. Document the schemas, collections, and initial data setup scripts for team reference and replication in testing and staging environments.
- **Responsible**: Database Administrator / Data Engineer
- **Output**: Initialized schemas in PostgreSQL and collections in MongoDB for the development environment, with test data inserted and setup scripts documented.

### Step 6: Configure Automated Backups
**Objective**: Set up automated daily backups with retention policies to ensure data durability and support recovery in case of data loss (SWREQ-DL-BACK-001).

- **Action**:
  1. For PostgreSQL on AWS RDS:
     - In the RDS console, navigate to the database instance settings for development.
     - Enable automated backups under the "Backup" section, setting a backup window (e.g., 02:00-03:00 AM local time) to minimize impact on operations.
     - Set a retention period for backups (e.g., 30 days) to allow recovery from recent data loss scenarios.
     - Enable point-in-time recovery (PITR) to restore the database to any point within the retention period.
  2. For MongoDB Atlas:
     - In the Atlas dashboard, navigate to the cluster settings for development.
     - Under "Backup", enable continuous backups or scheduled snapshots (e.g., daily at 03:00 AM).
     - Configure a retention policy (e.g., retain daily backups for 30 days, weekly for 13 weeks) to balance storage costs and recovery needs.
     - Optionally, enable point-in-time recovery for precise restoration if supported by the tier.
  3. Test backup functionality by triggering a manual backup for each database and verifying the backup files are created in the respective storage locations (e.g., AWS S3 for RDS, Atlas backup storage).
  4. Document the backup schedules, retention policies, and recovery procedures for both databases, including how to initiate a restore operation if needed.
- **Responsible**: Database Administrator / DevOps Engineer
- **Output**: Automated backup configurations for PostgreSQL and MongoDB with defined schedules and retention policies, verified through manual backup tests, and documented recovery procedures.

## Deliverables

- **Database Technology Selection**: Decision log specifying chosen technologies (e.g., PostgreSQL for relational, MongoDB for NoSQL data).
- **Provisioned Database Instances**: Deployed PostgreSQL and MongoDB instances for development, testing, and staging environments, with configurations documented or scripted via IaC.
- **Database Security Configurations**: Encryption at rest and in transit enabled for both databases, with connection security verified and documented.
- **Access Control Setup**: Configured access controls integrated with IAM where applicable, with test results and documentation of roles and restrictions.
- **Initialized Schemas and Collections**: Schemas in PostgreSQL for users, projects, and ASPICE compliance, and collections in MongoDB for agent logs and knowledge base, with test data and setup scripts documented.
- **Automated Backup Configurations**: Daily backup schedules with retention policies (e.g., 30 days) for both databases, verified through tests, with recovery procedures documented.

## Dependencies and Prerequisites

- Completion of Task 1: Cloud Environment Setup, ensuring a configured VPC with subnets and access to compute resources.
- Approval of the Phase 1 Infrastructure Setup Plan (`phase1_infrastructure_setup.md`).
- Availability of a cloud provider account with permissions to manage database services.
- Budget allocation for database service usage during the pre-production phase.
- Team members with expertise in database administration and security configurations.
- Access to necessary tools and documentation for database setup and management.

## Risks and Mitigation Strategies

- **Database Service Availability**: Delays in provisioning database instances due to cloud provider limits or service outages. Mitigation: Request resource quotas in advance, select alternative managed services if needed, and plan for manual setup as a fallback.
- **Security Misconfigurations**: Errors in encryption or access control settings exposing data to risks. Mitigation: Follow best practices for database security, conduct peer reviews of configurations, and test access restrictions before data population.
- **Data Consistency Issues**: Potential inconsistencies in schema design or initial data leading to application errors later. Mitigation: Design schemas/collections with future scalability in mind, validate with test data early, and involve data engineers in schema reviews.
- **Backup Failures**: Automated backups failing due to misconfigurations or storage issues. Mitigation: Test manual backups during setup, monitor backup status regularly, and allocate sufficient storage for retention policies.

## Conclusion

These Database Configuration Instructions provide a clear and actionable guide for completing Task 2 of Phase 1 in the Agentic System's pre-production roadmap. By following the outlined steps to select database technologies, provision instances, configure security, set up access controls, initialize schemas/collections, and establish automated backups, the project will ensure a robust data storage foundation for subsequent development phases. Successful completion of this task within Week 2 is critical to maintaining the overall timeline and supporting the data integrity, security, and durability required for the Agentic System as it progresses towards full functionality.
