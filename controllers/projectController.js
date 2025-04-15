import connectMySQL from "../dbConfig.js";
const ProjectController = {
  // ====== PROJET METHODS ======

  createProjet: async (req, res) => {
    const { nom, nom_client, tele, user_added, responsable_id } = req.body;

    if (!responsable_id) {
      return res.status(400).json({ message: "responsable_id is required" });
    }

    try {
      const db = await connectMySQL();

      // Step 1: Insert project
      const [result] = await db.execute(
        `INSERT INTO projet (nom, nom_client, tele, user_added, date_added) VALUES (?, ?, ?, ?, NOW())`,
        [nom, nom_client, tele, user_added]
      );

      const projetId = result.insertId;
      console.log('first id',projetId)
      // Step 2: Link project with responsable
      await db.execute(
        `INSERT INTO projet_has_responsable (projet_id, responsable_id) VALUES (?, ?)`,
        [projetId, responsable_id]
      );

      res.status(201).json({
        message: "Projet created successfully and linked to responsable.",
        projetId,
      });
    } catch (error) {
      console.error("Error creating project:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getAllProjets: async (req, res) => {
    try {
      const db = await connectMySQL();
      const [rows] = await db.execute(`SELECT * FROM projet WHERE deleted = 0`);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getProjetById: async (req, res) => {
    const { id } = req.params;
    try {
      const db = await connectMySQL();
      const [rows] = await db.execute(`SELECT * FROM projet WHERE id = ? AND deleted = 0`, [id]);
      if (rows.length === 0) return res.status(404).json({ message: "Projet not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateProjet: async (req, res) => {
    const { id } = req.params;
    const { nom, nom_client, tele, user_edit, date_updated = new Date() } = req.body;

    try {
      const db = await connectMySQL();
      await db.execute(
        `UPDATE projet SET nom = ?, nom_client = ?, tele = ?, user_edit = ?, date_updated = ? WHERE id = ?`,
        [nom, nom_client, tele, user_edit, date_updated, id]
      );
      res.json({ message: "Projet updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteProjet: async (req, res) => {
    const { id } = req.params;
    const { deleted_by, date_deleted = new Date() } = req.body;

    try {
      const db = await connectMySQL();
      await db.execute(
        `UPDATE projet SET deleted = 1, deleted_by = ?, date_deleted = ? WHERE id = ?`,
        [deleted_by, date_deleted, id]
      );
      res.json({ message: "Projet soft deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  findResponsableByPhone: async (phoneNumber) => {
    try {
      const db = await connectMySQL();
      let project = null;
      let responsables = [];
  
      // Step 1: Find the project by phone number
      const [projectRows] = await db.execute(
        `SELECT * FROM projet WHERE tele = ?`,
        [phoneNumber]
      );
  
      if (projectRows.length > 0) {
        project = projectRows[0];
        const projectId = project.id;
  
        // Step 2: Find responsable_id(s) linked to the project
        const [linkRows] = await db.execute(
          `SELECT responsable_id FROM projet_has_responsable WHERE projet_id = ?`,
          [projectId]
        );
  
        if (linkRows.length > 0) {
          // Step 3: Get full responsable details
          const responsableIds = linkRows.map((row) => row.responsable_id);
          const placeholders = responsableIds.map(() => '?').join(',');
  
          const [responsableRows] = await db.execute(
            `SELECT * FROM responsable WHERE id IN (${placeholders})`,
            responsableIds
          );
  
          responsables = responsableRows;
        }
    }
    console.log('this is the responsable',responsables)
      console.log('this is the project',project)
      return { project, responsables };
    } catch (err) {
      console.error("Error finding responsable by phone:", err.message);
      return null;
    }
  },
  
  

  // ====== RESPONSABLE METHODS ======

  createResponsable: async (req, res) => {
    const { nom, tele, user_added, date_added = new Date() } = req.body;

    try {
      const db = await connectMySQL();
      const [result] = await db.execute(
        `INSERT INTO responsable (nom, tele, user_added, date_added) VALUES (?, ?, ?, ?)`,
        [nom, tele, user_added, date_added]
      );
      res.status(201).json({ message: "Responsable created", responsableId: result.insertId });
    } catch (err) {
      console.error("Error creating responsable:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAllResponsables: async (req, res) => {
    try {
      const db = await connectMySQL();
      const [rows] = await db.execute(`SELECT * FROM responsable WHERE deleted = 0`);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getResponsableById: async (req, res) => {
    const { id } = req.params;
    try {
      const db = await connectMySQL();
      const [rows] = await db.execute(`SELECT * FROM responsable WHERE id = ? AND deleted = 0`, [id]);
      if (rows.length === 0) return res.status(404).json({ message: "Responsable not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateResponsable: async (req, res) => {
    const { id } = req.params;
    const { nom, tele, user_edit, date_updated = new Date() } = req.body;

    try {
      const db = await connectMySQL();
      await db.execute(
        `UPDATE responsable SET nom = ?, tele = ?, user_edit = ?, date_updated = ? WHERE id = ?`,
        [nom, tele, user_edit, date_updated, id]
      );
      res.json({ message: "Responsable updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteResponsable: async (req, res) => {
    const { id } = req.params;
    const { deleted_by, date_deleted = new Date() } = req.body;

    try {
      const db = await connectMySQL();
      await db.execute(
        `UPDATE responsable SET deleted = 1, deleted_by = ?, date_deleted = ? WHERE id = ?`,
        [deleted_by, date_deleted, id]
      );
      res.json({ message: "Responsable soft deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default  ProjectController;
