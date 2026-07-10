# Requirements Document

## 1. Application Overview

**Application Name**: AI CSV Analyzer Pro

**Description**: A modern, professional web application that enables users to upload CSV and Excel files for comprehensive data analysis, including statistical analysis, data cleaning, visualization, machine learning model training, and report generation. The application features a dark theme with glassmorphism design, responsive layout, and interactive dashboards.

## 2. Users and Usage Scenarios

**Target Users**: Data analysts, business analysts, researchers, students, and professionals who need to perform quick data analysis and machine learning tasks without coding.

**Core Usage Scenarios**:
- Upload and analyze CSV/XLSX datasets
- Perform data cleaning and preprocessing
- Generate statistical summaries and visualizations
- Train and compare machine learning models
- Export analysis reports and cleaned datasets

## 3. Page Structure and Functionality

```
AI CSV Analyzer Pro
├── Home Dashboard
├── Dataset Overview
├── Statistics Dashboard
├── Data Cleaning Module
├── Visualization Dashboard
├── AI Insights Engine
├── Machine Learning Dashboard
├── Model Comparison Dashboard
├── Feature Importance
├── Advanced Analytics
├── Report Generation
└── Export Options
```

### 3.1 Home Dashboard

**Purpose**: Entry point for file upload and project initialization

**Functionality**:
- Display application title「AI CSV Analyzer Pro」
- Provide file upload interface supporting CSV and XLSX formats
- Display uploaded file information (file name, size, upload time)
- Show success notification after successful upload
- Navigate to other dashboard sections via sidebar

### 3.2 Dataset Overview

**Purpose**: Display basic dataset information and preview

**Functionality**:
- Show dataset preview table (first 10-20 rows)
- Display key metrics:
  - Total Rows
  - Total Columns
  - Missing Values count
  - Duplicate Records count
  - Data Types Summary (number of numeric, categorical, datetime columns)

### 3.3 Statistics Dashboard

**Purpose**: Present comprehensive statistical analysis

**Functionality**:
- Generate and display statistical metrics for numeric columns:
  - Mean
  - Median
  - Mode
  - Standard Deviation
  - Variance
  - Min
  - Max
  - Quartiles (Q1, Q2, Q3)
  - Skewness
  - Kurtosis
- Display Correlation Matrix for numeric columns

### 3.4 Data Cleaning Module

**Purpose**: Provide data preprocessing and transformation options

**Functionality**:
- Offer data cleaning operations:
  - Remove Null Values
  - Fill Missing Values
  - Remove Duplicates
  - Outlier Detection
  - Outlier Removal
  - Label Encoding
  - One-Hot Encoding
  - Data Scaling
- Apply selected operations to dataset
- Update dataset preview after cleaning

### 3.5 Visualization Dashboard

**Purpose**: Generate interactive data visualizations

**Functionality**:
- Automatically generate charts using Plotly.js or Chart.js:
  - Histogram
  - Box Plot
  - Scatter Plot
  - Line Chart
  - Area Chart
  - Pie Chart
  - Bar Chart
  - Violin Plot
  - Distribution Plot
  - Correlation Heatmap
  - Pair Plot
  - Feature Importance Chart
- Display charts in responsive grid layout
- Support chart interaction (zoom, pan, hover tooltips)

### 3.6 AI Insights Engine

**Purpose**: Provide automated data analysis insights

**Functionality**:
- Generate and display insights:
  - Dataset size summary
  - Missing value summary
  - Strong correlations identification
  - Outliers detected
  - Distribution patterns
  - Business insights
  - Recommendations
- Present insights in card format

### 3.7 Machine Learning Dashboard

**Purpose**: Train and evaluate machine learning models

**Functionality**:
- Automatically detect target column type (categorical or numerical)
- For categorical target:
  - Train Classification Models: Logistic Regression, Random Forest, Decision Tree, XGBoost, SVM, KNN
  - Display metrics: Accuracy, Precision, Recall, F1 Score, AUC Score
  - Show ROC Curve, Confusion Matrix, Classification Report
- For numerical target:
  - Train Regression Models: Linear Regression, Random Forest Regressor, Decision Tree Regressor, XGBoost Regressor
  - Display metrics: R² Score, MAE, MSE, RMSE
- Present results for each model
- Store trained model results for use in Model Comparison Dashboard and Feature Importance section

### 3.8 Model Comparison Dashboard

**Purpose**: Compare performance of trained models

**Functionality**:
- Retrieve model performance data from Machine Learning Dashboard
- Generate simulated comparison data based on trained models:
  - For classification models: use Accuracy as primary metric
  - For regression models: use R² Score as primary metric
- Display interactive leaderboard using Recharts:
  - Bar chart showing model performance comparison
  - Table listing models with columns: Model Name, Performance Metric, Rank
- Highlight best performing model with visual indicator
- Sort models by performance metric in descending order
- Show metric name dynamically based on model type (Accuracy or R² Score)

### 3.9 Feature Importance

**Purpose**: Show feature contribution to model predictions

**Functionality**:
- Generate simulated feature importance data based on dataset features and trained models
- Calculate importance scores for each feature:
  - Use correlation with target variable as basis
  - Normalize scores to percentage values
  - Rank features by importance
- Display feature importance visualization using Recharts:
  - Horizontal bar chart showing top 10-15 features
  - X-axis: Importance Score (0-100%)
  - Y-axis: Feature Names
  - Color gradient indicating importance level
- Show detailed feature importance table:
  - Columns: Feature Name, Importance Score, Rank
  - Sort by importance score descending
- Display correlation coefficient with target variable for each feature

### 3.10 Advanced Analytics

**Purpose**: Perform statistical hypothesis testing

**Functionality**:
- Conduct and display results for:
  - T-Test
  - Z-Test
  - Chi-Square Test
  - ANOVA Test
- Show Covariance Matrix
- Perform Probability Distribution Analysis

### 3.11 Report Generation

**Purpose**: Generate downloadable analysis reports

**Functionality**:
- Generate reports in multiple formats:
  - PDF Report
  - CSV Summary
  - Excel Report
- PDF Report includes:
  - Dataset overview
  - Statistics summary
  - Missing values analysis
  - Visualizations
  - ML results
  - Best model identification
  - AI insights
- Provide download buttons for each report format

### 3.12 Export Options

**Purpose**: Export processed data and results

**Functionality**:
- Download Cleaned Dataset (CSV format)
- Download Report (PDF/Excel)
- Download Predictions (CSV format)

## 4. Business Rules and Logic

### 4.1 File Upload Rules
- Supported formats: CSV, XLSX
- Maximum file size: 200MB
- File processing uses Papa Parse for CSV and SheetJS for Excel

### 4.2 Data Processing Rules
- Dataset preview displays first 10-20 rows
- Statistical calculations apply only to numeric columns
- Correlation matrix includes only numeric columns
- Missing values count includes all columns

### 4.3 Machine Learning Rules
- Target column type detection:
  - If column contains text or has fewer than 10 unique values: categorical
  - If column contains numbers with more than 10 unique values: numerical
- Model training uses default train-test split
- Classification models apply to categorical targets
- Regression models apply to numerical targets
- Model results stored in application state for downstream use

### 4.4 Model Comparison Rules
- Model comparison data generated after Machine Learning Dashboard completes training
- Performance metrics extracted from trained model results:
  - Classification: Accuracy
  - Regression: R² Score
- Models ranked automatically by performance metric
- Leaderboard updates when new models are trained

### 4.5 Feature Importance Rules
- Feature importance calculated using simulated algorithm:
  - Calculate absolute correlation between each feature and target variable
  - Normalize correlation values to 0-100% scale
  - Add random variation to simulate model-specific importance
- Display top 10-15 most important features
- Features with missing or invalid data excluded from importance calculation
- Importance scores recalculated when dataset or target column changes

### 4.6 Visualization Rules
- Charts automatically select appropriate columns based on data types
- Numeric columns used for histograms, box plots, scatter plots
- Categorical columns used for pie charts, bar charts
- Correlation heatmap uses numeric columns only
- Recharts used for Model Comparison and Feature Importance visualizations

### 4.7 Report Generation Rules
- PDF generation uses jsPDF library
- Reports include all analysis results from current session
- Export files use original dataset name as prefix

### 4.8 Performance Optimization Rules
- Use caching for processed data
- Implement memory optimization for large datasets
- Process data on client-side to reduce server load

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| File upload fails | Display error message, allow retry |
| Unsupported file format | Show format error, list supported formats |
| File exceeds 200MB | Display size limit error, reject upload |
| Dataset has no numeric columns | Skip statistical analysis, show notification |
| Dataset has no categorical columns | Skip classification models, show notification |
| All values missing in column | Exclude column from analysis, show warning |
| Insufficient data for ML training | Display minimum data requirement message |
| Model training fails | Show error message, skip failed model |
| Chart rendering fails | Display fallback message, continue with other charts |
| PDF generation fails | Show error notification, allow retry |
| No models trained | Display message in Model Comparison Dashboard: \"Train models first\" |
| Target column not selected | Show prompt to select target column before viewing Feature Importance |
| Feature importance calculation fails | Display error message, show empty state |
| Recharts library fails to load | Display fallback text-based comparison table |

## 6. Acceptance Criteria

1. User uploads a CSV or XLSX file on Home Dashboard
2. System displays dataset preview and overview metrics in Dataset Overview section
3. User navigates to Statistics Dashboard and views statistical analysis results
4. User applies data cleaning operations in Data Cleaning Module
5. User views automatically generated visualizations in Visualization Dashboard
6. System trains machine learning models and displays results in Machine Learning Dashboard
7. User navigates to Model Comparison Dashboard and views interactive bar chart and leaderboard table comparing model performance using Recharts
8. User navigates to Feature Importance section and views horizontal bar chart showing top features with importance scores and detailed table using Recharts
9. User generates and downloads PDF report from Report Generation section

## 7. Out of Scope for Current Release

- User authentication and login system
- Multi-user collaboration features
- Cloud storage integration
- Real-time data streaming analysis
- Custom model parameter tuning interface
- API integration for external data sources
- Scheduled report generation
- Email notification system
- Data versioning and history tracking
- Advanced data transformation workflows
- Custom chart creation tools
- Mobile native applications (iOS/Android)
- Offline mode functionality
- Backend server for actual machine learning model training
- Integration with external machine learning libraries or services